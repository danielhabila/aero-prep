"use client";
import { useState } from "react";
import StatCard from "./StatCard";

const Quiz = ({ questions, userId }) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { question, answers, correctAnswer } = questions[activeQuestion];

  const onAnswerSelected = (answer, idx) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    if (answer === correctAnswer) {
      setSelectedAnswer(answer);
    } else {
      setSelectedAnswer("");
    }
  };

  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    setResults((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
      fetch("/api/quizResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          quizScore: results.score,
          correctAnswers: results.correctAnswers,
          wrongAnswers: results.wrongAnswers,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not working fam");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Quiz results saved successfully:", data);
        })
        .catch((error) => {
          console.error("Error saving quiz results:", error);
        });
    }
    setChecked(false);
  };
  return (
    <div className="min-h-[500px] ">
      <div className="max-w-6xl px-4 sm:px-6 mx-auto flex justify-center py-10 flex-col">
        {!showResults ? (
          <>
            <div className="flex justify-start mb-10 w-fit bg-blue-700 text-white px-4 rounded-md py-1 text-lg font-medium">
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
            </div>

            <div>
              <h3 className="mb-5 text-2xl font-bold">{question}</h3>
              <ul>
                {answers.map((answer, idx) => (
                  <li
                    key={idx}
                    onClick={() => onAnswerSelected(answer, idx)}
                    className={`cursor-pointer tracking-wide font-medium mb-5 py-3 rounded-md border border-gray-700 hover:bg-gray-600 hover:text-white px-8
                    ${selectedAnswerIndex === idx && "bg-light text-dark"}
                    `}
                  >
                    <span>{answer}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={nextQuestion}
                disabled={!checked}
                className="font-bold"
              >
                {activeQuestion === questions.length - 1
                  ? "Finish"
                  : "Next Question →"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl uppercase mb-10">Results 📈</h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
              <StatCard
                title="Percentage"
                value={`${(results.score / 50) * 100}%`}
              />
              <StatCard title="Total Questions" value={questions.length} />
              <StatCard title=" Total Score" value={results.score} />
              <StatCard
                title="Correct Answers"
                value={results.correctAnswers}
              />
              <StatCard title="Wrong Answers" value={results.wrongAnswers} />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 font-bold uppercase"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
