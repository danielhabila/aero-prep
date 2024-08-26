"use client";
import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import axios from "axios";

export default function Quiz({ questions, email }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    answers: Array(questions.length).fill(null),
  });

  useEffect(() => {
    console.log("Active Question:", activeQuestion);
    console.log("Selected Answer:", selectedAnswer);
    console.log("Selected Answer Index:", selectedAnswerIndex);
    console.log("Show Results:", showResults);
    console.log("Results:", results);
  }, [
    activeQuestion,
    selectedAnswer,
    selectedAnswerIndex,
    showResults,
    results,
  ]);

  useEffect(() => {
    const currentAnswer = results.answers[activeQuestion];
    console.log("currentAnswer", currentAnswer);
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer);
      setSelectedAnswerIndex(
        questions[activeQuestion].answers.findIndex(
          (answer) => answer === currentAnswer.selectedAnswer
        )
      );
    } else {
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
    }
  }, [activeQuestion, results.answers, questions]);

  useEffect(() => {
    // Set the quiz start time when the component mounts
    setQuizStartTime(new Date().toISOString());
  }, []);

  const onAnswerSelected = (answer, idx) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    setResults((prev) => {
      const updatedAnswers = [...prev.answers];
      updatedAnswers[activeQuestion] = {
        question: questions[activeQuestion].question,
        selectedAnswer: answer,
        correctAnswer: questions[activeQuestion].correctAnswer,
      };
      return { ...prev, answers: updatedAnswers };
    });
  };

  const gradeCurrentQuestion = () => {
    setResults((prev) => {
      const isCorrect =
        selectedAnswer === questions[activeQuestion].correctAnswer;
      return {
        ...prev,
        correctAnswers: isCorrect
          ? prev.correctAnswers + 1
          : prev.correctAnswers,
        wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
      };
    });
  };

  const nextQuestion = () => {
    gradeCurrentQuestion();
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const finalResults = questions.reduce(
      (acc, question, idx) => {
        const userAnswer = results.answers[idx]?.selectedAnswer;
        if (userAnswer === question.correctAnswer) {
          acc.correctAnswers += 1;
        } else {
          acc.wrongAnswers += 1;
        }
        return acc;
      },
      {
        correctAnswers: 0,
        wrongAnswers: 0,
        answers: results.answers,
        startTime: quizStartTime,
        examType: "Complete Exam - PPAER",
        numberOfQuestions: questions.length,
        scorePercentage: 0, // We'll calculate this after counting correct answers
      }
    );

    // Calculate score percentage
    finalResults.scorePercentage = Math.floor(
      (finalResults.correctAnswers / questions.length) * 100
    );

    setResults((prev) => ({
      ...prev,
      correctAnswers: finalResults.correctAnswers,
      wrongAnswers: finalResults.wrongAnswers,
    }));

    setShowResults(true);

    try {
      const response = await axios.post("/api/quizResults", {
        results: finalResults,
        email,
      });
      if (response.status !== 200)
        throw new Error("Network response was not ok");

      console.log("Quiz results saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  const previousQuestion = () => {
    if (activeQuestion > 0) setActiveQuestion((prev) => prev - 1);
  };

  const goToQuestion = (index) => setActiveQuestion(index);

  return (
    <div className="min-h-[500px]">
      <div className="max-w-6xl px-4 sm:px-6 mx-auto flex justify-center py-10 flex-col">
        <div className="flex justify-end">
          {!showResults && (
            <button
              onClick={submitQuiz}
              className="font-bold hover:bg-gray-600 px-3 py-1.5 rounded-lg mr-2 w-fit"
            >
              Submit
            </button>
          )}
        </div>
        {!showResults ? (
          <>
            <div className="flex justify-start mb-10 w-fit bg-blue-700 text-white px-4 rounded-md py-1 text-lg font-medium md:hidden">
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
            </div>
            <div className="hidden md:flex justify-center mb-10">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className={`mx-1 px-3 py-1 rounded-full ${
                    idx === activeQuestion
                      ? "bg-blue-700 border-2 border-ring"
                      : results.answers[idx]
                        ? "bg-blue-300"
                        : "bg-gray-500"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div>
              <h3 className="mb-5 text-2xl font-bold">
                {questions[activeQuestion].question}
              </h3>
              <ul>
                {questions[activeQuestion].answers.map((answer, idx) => (
                  <li
                    key={idx}
                    onClick={() => onAnswerSelected(answer, idx)}
                    className={`cursor-pointer tracking-wide font-medium mb-5 py-3 rounded-md border border-gray-700 hover:bg-gray-600 hover:text-white px-8 ${
                      selectedAnswerIndex === idx && "bg-light text-dark"
                    }`}
                  >
                    <span>{answer}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between">
                {activeQuestion > 0 && (
                  <button
                    onClick={previousQuestion}
                    className="font-bold hover:bg-gray-600 px-3 py-1.5 rounded-lg"
                  >
                    ← Previous
                  </button>
                )}
                <button
                  onClick={nextQuestion}
                  className="font-bold hover:bg-gray-600 px-3 py-1.5 rounded-lg"
                >
                  {activeQuestion === questions.length - 1
                    ? "Finish"
                    : "Next →"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl uppercase mb-10">Results 📈</h3>
            <h1
              title="Percentage"
              className="md:text-6xl text-4xl font-bold mb-10"
            >
              You scored{" "}
              {`${Math.floor((results.correctAnswers / questions.length) * 100)}%`}
            </h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
              <StatCard title="Total Questions" value={questions.length} />
              <StatCard
                title="Correct Answers"
                value={results.correctAnswers}
              />
              <StatCard
                title="Wrong Answers / Unanswered"
                value={results.wrongAnswers}
              />
            </div>
            <div className="mt-10">
              <div className="flex justify-center">
                {results.answers.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`mx-1 px-3 py-1 rounded-full mb-10 ${
                      result && result.selectedAnswer === result.correctAnswer
                        ? "bg-green-500"
                        : "bg-red-500"
                    } ${activeQuestion === idx && "border-2 border-slate-100"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div>
                <p className="font-bold text-xl mb-5">
                  {results.answers[activeQuestion]?.question ||
                    questions[activeQuestion].question}
                </p>
                <ul>
                  {questions[activeQuestion].answers.map((answer, idx) => (
                    <li
                      key={idx}
                      className={`mb-2 ${
                        answer === questions[activeQuestion].correctAnswer
                          ? "text-green-500"
                          : answer ===
                              results.answers[activeQuestion]?.selectedAnswer
                            ? "text-red-500"
                            : ""
                      }`}
                    >
                      {answer}
                    </li>
                  ))}
                </ul>
              </div>
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
}
