import StatCard from "./StatCard";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import passImage from "../public/images/pass.png";
import failImage from "../public/images/fail.png";
import { useState } from "react";
import axios from "axios";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function RenderResults({
  results,
  questions,
  quizType,
  activeQuestion,
  setActiveQuestion,
  components,
  onExit,
  fetchNewQuiz,
  isStats = false,
  aiExplanations = {},
  setAiExplanations,
}) {
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(null);

  const correctAnswersCount = results.answers.filter(
    (result) => result && result.selectedAnswer === result.correctAnswer
  ).length;

  const scorePercentage = Math.floor(
    (correctAnswersCount / questions.length) * 100
  );

  const passMark = quizType === "pstar" ? 90 : 60;
  const isPassed = scorePercentage >= passMark;

  const restartQuiz = async () => {
    await fetchNewQuiz();
  };

  const scrollToQuestion = () => {
    const questionElement = document.getElementById("question-container");
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const previousQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion((prev) => prev - 1);
      setTimeout(scrollToQuestion, 100);
    }
  };

  const nextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      setTimeout(scrollToQuestion, 100);
    }
  };

  const fetchExplanation = async (question, correctAnswer, questionIndex) => {
    setLoadingQuestion(questionIndex);
    try {
      const response = await axios.post("/api/generateExplanation", {
        question:
          typeof question === "string"
            ? question
            : question[0]?.children[0]?.text,
        correctAnswer,
      });

      setAiExplanations((prev) => ({
        ...prev,
        [questionIndex]: response.data.explanation,
      }));
    } catch (error) {
      console.error("Error fetching explanation:", error);
    } finally {
      setLoadingQuestion(null);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-10">
        <Image
          src={isPassed ? passImage : failImage}
          alt={isPassed ? "Pass" : "Fail"}
          className={`mx-auto md:w-24 w-20 bg-${isPassed ? "green" : "red"}-500 rounded-full p-1`}
        />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <StatCard
          title="Score Percentage"
          value={`${scorePercentage}%`}
          status={isPassed ? "PASSED" : "FAILED"}
          statusColor={isPassed ? "text-green-500" : "text-red-500"}
        />
        <StatCard title="Pass Mark" value={`${passMark}%`} />
        <StatCard title="Correct Answers" value={correctAnswersCount} />
        <StatCard
          title="Wrong Answers"
          value={questions.length - correctAnswersCount}
        />
      </div>
      <div className="mt-10">
        <div className="flex flex-wrap gap-2 mb-10 ">
          {results.answers.map((result, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveQuestion(idx);
                setTimeout(scrollToQuestion, 100);
              }}
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
        <div id="question-container" className="space-y-8 pt-4">
          <div className="flex justify-start mb-10 w-fit bg-blue-700 text-white px-4 rounded-md py-1 text-lg font-medium ">
            <h2>
              Question: {activeQuestion + 1}
              <span>/{questions.length}</span>
            </h2>
          </div>
          <p className="font-medium text-xl mb-5 text-left">
            {typeof questions[activeQuestion].question === "string" ? (
              questions[activeQuestion].question
            ) : (
              <PortableText
                value={questions[activeQuestion].question}
                components={components}
              />
            )}
          </p>
          <ul>
            {questions[activeQuestion].answers.map((answer, idx) => (
              <li
                key={idx}
                className={`cursor-default tracking-wide font-medium mb-5 py-3 rounded-md border border-gray-700 px-8 ${
                  answer === questions[activeQuestion].correctAnswer
                    ? "bg-green-500/20 border-green-500"
                    : answer === results.answers[activeQuestion]?.selectedAnswer
                      ? "bg-red-500/20 border-red-500"
                      : ""
                }`}
              >
                {typeof answer === "string" ? (
                  <span
                    className={`${
                      answer === questions[activeQuestion].correctAnswer
                        ? "text-green-400"
                        : answer ===
                            results.answers[activeQuestion]?.selectedAnswer
                          ? "text-red-400"
                          : "text-gray-300"
                    }`}
                  >
                    {answer}
                  </span>
                ) : (
                  <PortableText value={answer} components={components} />
                )}
                {answer === results.answers[activeQuestion]?.selectedAnswer &&
                  answer !== questions[activeQuestion].correctAnswer && (
                    <span className="ml-2 text-red-500">(Your answer)</span>
                  )}
              </li>
            ))}
          </ul>
          {questions[activeQuestion].explanation &&
          ((typeof questions[activeQuestion].explanation === "string" &&
            questions[activeQuestion].explanation.trim() !== "") ||
            (Array.isArray(questions[activeQuestion].explanation) &&
              questions[activeQuestion].explanation.length > 0)) ? (
            <div className="mt-4 text-left">
              <h4 className="font-bold mb-2">Explanation:</h4>
              {typeof questions[activeQuestion].explanation === "string" ? (
                <p>{questions[activeQuestion].explanation}</p>
              ) : (
                <PortableText
                  value={questions[activeQuestion].explanation}
                  components={components}
                />
              )}
            </div>
          ) : null}
          {!questions[activeQuestion].explanation && (
            <div className="mt-4 text-left">
              {!aiExplanations[activeQuestion] && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() =>
                      fetchExplanation(
                        questions[activeQuestion].question,
                        questions[activeQuestion].correctAnswer,
                        activeQuestion
                      )
                    }
                    disabled={loadingQuestion !== null}
                    className="flex items-center gap-2 bg-blue-600   hover:bg-blue-700 disabled:bg-blue-600/50 
                      text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
                  >
                    {loadingQuestion === activeQuestion ? (
                      <>
                        Thinking...
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.148 7.935l3.502-3.502z"
                          />
                        </svg>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        Get Explanation
                        <SparklesIcon className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>
              )}
              {aiExplanations[activeQuestion] && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-md">
                  <h4 className="font-bold mb-2 text-blue-400">
                    Generated Explanation:
                  </h4>
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {aiExplanations[activeQuestion].replace(/\\n/g, "\n")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-10 mb-6">
        <button
          onClick={previousQuestion}
          disabled={activeQuestion === 0}
          className={`font-bold px-4 py-1.5 w-32 rounded-full ${
            activeQuestion === 0
              ? "bg-blue-600/50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={activeQuestion === questions.length - 1}
          className={`font-bold px-4 py-1.5 w-32 rounded-full ${
            activeQuestion === questions.length - 1
              ? "bg-blue-600/50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
      {!isStats && (
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={restartQuiz}
            className="mt-10 font-bold w-full bg-white text-black px-4 py-2 rounded-full hover:bg-white/80 transition-colors"
          >
            Restart Quiz
          </button>
          <button
            onClick={onExit}
            className="font-bold bg-red-600 text-white px-4 py-2 w-full rounded-full hover:bg-red-700 transition-colors"
          >
            Exit Quiz
          </button>
        </div>
      )}
    </div>
  );
}
