"use client";
import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import axios from "axios";
import { PortableText, PortableTextComponents } from "@portabletext/react";

const CustomLink = ({ value, children }) => {
  const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
  return (
    <a
      href={value?.href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

const components = {
  marks: {
    link: CustomLink,
  },
};

export default function QuizComponent({
  questions,
  email,
  quizType,
  title,
  onExit,
}) {
  // State management
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime] = useState(new Date().toISOString());
  const [results, setResults] = useState({
    answers: Array(questions.length).fill(null),
  });

  // Update selected answer when active question changes
  useEffect(() => {
    const currentAnswer = results.answers[activeQuestion];
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer);
      setSelectedAnswerIndex(
        questions[activeQuestion].answers.indexOf(currentAnswer.selectedAnswer)
      );
    } else {
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
    }
  }, [activeQuestion, results.answers, questions]);

  // Handle answer selection
  const onAnswerSelected = (answer, idx) => {
    setSelectedAnswer(answer);
    setSelectedAnswerIndex(idx);
    setResults((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) =>
        i === activeQuestion
          ? {
              question: questions[activeQuestion].question,
              selectedAnswer: answer,
              correctAnswer: questions[activeQuestion].correctAnswer,
            }
          : a
      ),
    }));
  };

  // Grade current question and move to next
  const nextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  // Submit quiz results
  const submitQuiz = async () => {
    const correctAnswersCount = results.answers.filter(
      (result) => result && result.selectedAnswer === result.correctAnswer
    ).length;

    const finalResults = {
      startTime: quizStartTime,
      examType:
        quizType === "pstar" ? "Complete Exam - PSTAR" : "Complete Exam - PPL",
      numberOfQuestions: questions.length,
      scorePercentage: Math.floor(
        (correctAnswersCount / questions.length) * 100
      ),
      correctAnswers: correctAnswersCount,
      wrongAnswers: questions.length - correctAnswersCount,
      questions: questions.map((q, index) => ({
        question: q.question,
        answers: q.answers,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedAnswer: results.answers[index]?.selectedAnswer || null,
      })),
    };
    console.log("finalResults", finalResults);
    setShowResults(true);

    try {
      const response = await axios.post("/api/quizResults", {
        results: finalResults,
        email,
      });
      if (response.status !== 200)
        throw new Error("Network response was not ok");
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  // Navigation functions
  const previousQuestion = () =>
    activeQuestion > 0 && setActiveQuestion((prev) => prev - 1);
  const goToQuestion = (index) => setActiveQuestion(index);

  // Render functions
  const renderQuestionNavigation = () => (
    <div className="hidden mb-14 md:flex md:flex-wrap md:gap-1">
      {questions.map((_, idx) => (
        <button
          key={idx}
          onClick={() => goToQuestion(idx)}
          className={`m-0.5 h-10 w-10 rounded-full ${
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
  );

  const renderQuestion = () => (
    <>
      {questions[activeQuestion].question && (
        <h3 className="mb-10 text-2xl font-bold">
          {/* {quizType === "pstar" ? ( */}
          {quizType === "pstar" || quizType === "airlaw" ? (
            questions[activeQuestion].question
          ) : (
            <PortableText
              value={questions[activeQuestion].question}
              components={components}
            />
          )}
        </h3>
      )}
      <ul>
        {questions[activeQuestion].answers.map((answer, idx) => (
          <li
            key={idx}
            onClick={() => onAnswerSelected(answer, idx)}
            className={`cursor-pointer tracking-wide font-medium mb-5 py-3 rounded-md border border-gray-700 hover:bg-gray-600 hover:text-white px-8 ${
              selectedAnswerIndex === idx &&
              "bg-slate-100 hover:bg-slate-100 text-dark hover:text-black"
            }`}
          >
            <span>{answer}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between">
        <div>
          {activeQuestion > 0 && (
            <button
              onClick={previousQuestion}
              className="font-bold hover:bg-gray-600 px-3 py-1.5 rounded-lg"
            >
              ← Previous
            </button>
          )}
        </div>
        <button
          onClick={nextQuestion}
          className="font-bold hover:bg-gray-600 px-3 py-1.5 rounded-lg"
        >
          {activeQuestion === questions.length - 1 ? "Finish" : "Next →"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
        {!showResults && (
          <button
            onClick={submitQuiz}
            className="font-bold bg-white text-black hover:bg-white/80 px-4 py-1.5 rounded-lg w-fit"
          >
            Finish Attempt
          </button>
        )}
        <button
          onClick={onExit}
          className="mt-10 font-bold bg-red-500 text-white px-10 py-1.5 w-fit rounded-lg hover:bg-red-600 transition-colors"
        >
          Exit Quiz
        </button>
      </div>
    </>
  );

  // Reset active question when results are shown
  useEffect(() => {
    if (showResults) {
      setActiveQuestion(0);
    }
  }, [showResults]);

  const renderResults = () => {
    const correctAnswersCount = results.answers.filter(
      (result) => result && result.selectedAnswer === result.correctAnswer
    ).length;

    const restartQuiz = () => {
      setActiveQuestion(0);
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
      setShowResults(false);
      setResults({
        answers: Array(questions.length).fill(null),
      });
    };

    return (
      <div className="text-center">
        <h3 className="text-2xl uppercase mb-10">Results 📈</h3>
        <h1 title="Percentage" className="md:text-6xl text-4xl font-bold mb-10">
          You scored{" "}
          {`${Math.floor((correctAnswersCount / questions.length) * 100)}%`}
        </h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
          <StatCard title="Total Questions" value={questions.length} />
          <StatCard title="Correct Answers" value={correctAnswersCount} />
          <StatCard
            title="Wrong Answers / Unanswered"
            value={questions.length - correctAnswersCount}
          />
        </div>
        <div className="mt-10">
          <div className="flex flex-wrap gap-2 mb-10">
            {results.answers.map((result, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`mm-0.5 h-10 w-10 rounded-full ${
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
            {questions[activeQuestion].explanation && (
              <div className="mt-4 text-left">
                <h4 className="font-bold mb-2">Explanation:</h4>
                <PortableText value={questions[activeQuestion].explanation} />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-10">
          <button
            onClick={restartQuiz}
            className="mt-10 font-bold uppercase bg-white text-black px-4 py-2 rounded-lg hover:bg-white/80 transition-colors"
          >
            Restart Quiz
          </button>
          <button
            onClick={onExit}
            className="mt-10 font-bold bg-red-500 text-white px-10 py-1.5 w-fit rounded-lg hover:bg-red-600 transition-colors"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[500px]">
      <div className="max-w-6xl px-4 sm:px-6 mx-auto flex justify-center py-10 flex-col">
        <h1 className="text-3xl font-bold mb-10 text-center ">{title}</h1>

        {!showResults ? (
          <>
            <div className="flex justify-start mb-10 w-fit bg-blue-700 text-white px-4 rounded-md py-1 text-lg font-medium md:hidden">
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
            </div>
            {renderQuestionNavigation()}
            {renderQuestion()}
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
}
