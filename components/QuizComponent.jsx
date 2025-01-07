"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PortableText } from "@portabletext/react";

import RenderResults from "./RenderResults";

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
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-bold mb-2">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-400 hover:underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default function QuizComponent({
  questions: initialQuestions,
  email,
  quizType,
  title,
  onExit,
  initialState,
  studyMode,
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  // State management
  const [activeQuestion, setActiveQuestion] = useState(
    initialState?.activeQuestion || 0
  );
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime] = useState(
    initialState?.quizStartTime || new Date().toISOString()
  );
  const [results, setResults] = useState(
    initialState?.results || {
      answers: Array(questions.length).fill(null),
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    new Set(initialState?.answeredQuestions || [])
  );
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingQuestion, setLoadingQuestion] = useState(null);

  // Update selected answer when active question changes
  useEffect(() => {
    const currentAnswer = results.answers[activeQuestion];
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer);
      setSelectedAnswerIndex(
        questions[activeQuestion].answers.indexOf(currentAnswer.selectedAnswer)
      );
      if (studyMode && answeredQuestions.has(activeQuestion)) {
        setShowAnswer(true);
        setIsCorrect(
          currentAnswer.selectedAnswer ===
            questions[activeQuestion].correctAnswer
        );
      } else {
        setShowAnswer(false);
        setIsCorrect(null);
      }
    } else {
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
      setShowAnswer(false);
      setIsCorrect(null);
    }
  }, [
    activeQuestion,
    results.answers,
    questions,
    studyMode,
    answeredQuestions,
  ]);

  // Handle answer selection
  const onAnswerSelected = (answer, idx) => {
    if (!showAnswer) {
      setSelectedAnswer(answer);
      setSelectedAnswerIndex(idx);

      if (studyMode) {
        setShowAnswer(true);
        setIsCorrect(answer === questions[activeQuestion].correctAnswer);
        setAnsweredQuestions((prev) => new Set([...prev, activeQuestion]));
      }

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
    }
  };

  // Grade current question and move to next
  const nextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      if (!studyMode) {
        setShowAnswer(false);
        setIsCorrect(null);
        setSelectedAnswer("");
        setSelectedAnswerIndex(null);
      }
    } else {
      submitQuiz();
    }
  };

  // Submit quiz results
  const submitQuiz = async () => {
    const correctAnswersCount = results.answers.filter(
      (result) => result && result.selectedAnswer === result.correctAnswer
    ).length;

    const scorePercentage = Math.floor(
      (correctAnswersCount / questions.length) * 100
    );

    const isPassed =
      quizType === "pstar" ? scorePercentage >= 90 : scorePercentage >= 60;

    const finalResults = {
      startTime: quizStartTime,
      examType: (() => {
        switch (quizType) {
          case "pstar":
            return "PSTAR Exam";
          case "pplAirlawPtca":
            return "PPL Airlaw Exam";
          case "pplMetPtca":
            return "PPL Meteorology Exam";
          case "pplGenPtca":
            return "PPL General Knowledge Exam";
          case "pplNavPtca":
            return "PPL Navigation Exam";
          case "full":
            return "PPL Complete Exam";
          case "inratMello":
            return "INRAT Exam";
          default:
            return `${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Exam`;
        }
      })(),
      numberOfQuestions: questions.length,
      scorePercentage,
      correctAnswers: correctAnswersCount,
      wrongAnswers: questions.length - correctAnswersCount,
      passed: isPassed,
      questions: questions.map((q, index) => ({
        question: q.question,
        answers: q.answers,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedAnswer: results.answers[index]?.selectedAnswer || null,
      })),
    };
    setShowResults(true);

    try {
      // Save quiz results
      await axios.post("/api/quizResults", {
        results: finalResults,
        email,
      });

      // Delete saved progress
      await axios.delete("/api/quizProgress", {
        params: { email },
      });
    } catch (error) {
      console.error("Error handling quiz completion:", error);
    }
  };

  // Navigation functions
  const previousQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion((prev) => prev - 1);
      if (!studyMode) {
        setShowAnswer(false);
        setIsCorrect(null);
        setSelectedAnswer("");
        setSelectedAnswerIndex(null);
      }
    }
  };
  const goToQuestion = (index) => setActiveQuestion(index);

  // Render functions
  const renderQuestionNavigation = () => (
    <div className=" mb-14 flex-wrap gap-1">
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
        <h3 className="mb-10 text-xl font-medium ">
          {typeof questions[activeQuestion].question === "string" ? (
            questions[activeQuestion].question
          ) : (
            <PortableText
              value={questions[activeQuestion].question}
              components={components}
            />
          )}
        </h3>
      )}
      <ul className="mb-10">
        {questions[activeQuestion].answers.map((answer, idx) => (
          <li
            key={idx}
            onClick={() => !showAnswer && onAnswerSelected(answer, idx)}
            className={`cursor-pointer tracking-wide font-medium mb-5 py-3 rounded-md border px-8 
              ${
                studyMode && showAnswer && answeredQuestions.has(activeQuestion)
                  ? answer === questions[activeQuestion].correctAnswer
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : answer === selectedAnswer
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "border-gray-700 text-gray-300"
                  : selectedAnswerIndex === idx
                    ? "bg-slate-100 hover:bg-slate-100 text-dark hover:text-black"
                    : "border-gray-700 hover:bg-gray-600"
              }`}
          >
            {typeof answer === "string" ? (
              <span>{answer}</span>
            ) : (
              <PortableText value={answer} components={components} />
            )}
          </li>
        ))}
      </ul>

      {studyMode &&
        showAnswer &&
        answeredQuestions.has(activeQuestion) &&
        questions[activeQuestion].explanation && (
          <div className="my-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-md">
            <h4 className="font-bold mb-2 text-blue-400">Explanation:</h4>
            {typeof questions[activeQuestion].explanation === "string" ? (
              <p>{questions[activeQuestion].explanation}</p>
            ) : (
              <PortableText
                value={questions[activeQuestion].explanation}
                components={components}
              />
            )}
          </div>
        )}

      {studyMode && showAnswer && !questions[activeQuestion].explanation && (
        <div className="mt-4 mb-10 text-left">
          {!aiExplanations[activeQuestion] && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  fetchExplanation(
                    questions[activeQuestion].question,
                    questions[activeQuestion].correctAnswer,
                    activeQuestion
                  )
                }
                disabled={loadingQuestion !== null}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 
                  text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
              >
                {loadingQuestion === activeQuestion ? (
                  <>
                    Thinking...
                    <svg
                      className="animate-spin h-5 w-5 ml-2"
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
                  <>Get Explanation</>
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

      <div className="flex justify-between">
        <div>
          {activeQuestion > 0 && (
            <button
              onClick={previousQuestion}
              className="font-bold px-4 py-1.5 w-32 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              Previous
            </button>
          )}
        </div>
        <button
          onClick={nextQuestion}
          className="font-bold bg-blue-600 hover:bg-blue-700 px-4 py-1.5 w-32 rounded-full"
        >
          {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-16 gap-4">
        {!showResults && (
          <button
            onClick={submitQuiz}
            className="font-bold bg-white text-black hover:bg-white/80 px-10 py-1.5 rounded-full w-full"
          >
            Finish Attempt
          </button>
        )}

        <button
          onClick={saveAndQuit}
          disabled={isSaving}
          className=" font-bold bg-yellow-500 text-white px-16 py-1.5 w-full rounded-full hover:bg-yellow-600 transition-colors "
        >
          {isSaving ? "Saving..." : "Save and Quit"}
        </button>
        <button
          onClick={onExit}
          className=" font-bold bg-red-500 text-white px-16 py-1.5 w-full rounded-full hover:bg-red-600 transition-colors"
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

  // Define the saveAndQuit function
  const saveAndQuit = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/quizProgress", {
        email,
        quizType,
        activeQuestion,
        questions,
        results,
        quizStartTime,
      });
      onExit();
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchNewQuiz = async () => {
    try {
      const count = quizType === "pstar" ? 50 : quizType === "full" ? 100 : 25;
      const response = await axios.get("/api/getQuizQuestions", {
        params: { type: quizType, count: count },
      });
      setQuestions(response.data);
      setActiveQuestion(0);
      setSelectedAnswer("");
      setSelectedAnswerIndex(null);
      setShowResults(false);
      setResults({
        answers: Array(response.data.length).fill(null),
      });
    } catch (error) {
      console.error("Error fetching new quiz questions:", error);
    }
  };

  const restartQuiz = async () => {
    setAiExplanations({});
    await fetchNewQuiz();
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
    <div className="min-h-[500px]">
      <div className="max-w-6xl px-4 sm:px-6 mx-auto flex justify-center py-10 flex-col">
        <h1 className="text-3xl font-bold mb-10 text-center ">
          {`${title} ${showResults ? "Results" : ""}`}
        </h1>

        {!showResults ? (
          <>
            {/* <div className="flex justify-start mb-10 w-fit bg-blue-700 text-white px-4 rounded-md py-1 text-lg font-medium md:hidden">
              <h2>
                Question: {activeQuestion + 1}
                <span>/{questions.length}</span>
              </h2>
            </div> */}
            {renderQuestionNavigation()}
            {renderQuestion()}
          </>
        ) : (
          <RenderResults
            results={results}
            questions={questions}
            quizType={quizType}
            activeQuestion={activeQuestion}
            setActiveQuestion={setActiveQuestion}
            setSelectedAnswer={setSelectedAnswer}
            setSelectedAnswerIndex={setSelectedAnswerIndex}
            setShowResults={setShowResults}
            setResults={setResults}
            components={components}
            onExit={onExit}
            fetchNewQuiz={fetchNewQuiz}
            aiExplanations={aiExplanations}
            setAiExplanations={setAiExplanations}
          />
        )}
      </div>
    </div>
  );
}
