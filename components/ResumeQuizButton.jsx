"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResumeQuizButton({ email, onResumeQuiz }) {
  const [savedQuiz, setSavedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedQuiz = async () => {
      try {
        const response = await axios.get("/api/quizProgress", {
          params: { email },
        });
        setSavedQuiz(response.data.quizProgress);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching saved quiz:", error);
        }
        setSavedQuiz(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchSavedQuiz();
    }
  }, [email]);

  if (isLoading || !savedQuiz || !savedQuiz.quizType) return null;

  const getQuizTitle = (quizType) => {
    switch (quizType) {
      case "pstar":
        return "PSTAR";
      case "rocA":
        return "ROC-A";
      case "pplAirlawPtca":
        return "PPL Airlaw";
      case "pplMetPtca":
        return "PPL Meteorology";
      case "pplGenPtca":
        return "PPL General Knowledge";
      case "pplNavPtca":
        return "PPL Navigation";
      case "full":
        return "PPL Complete";
      default:
        return quizType;
    }
  };

  return (
    <div className="w-full text-center mb-8">
      <button
        onClick={() => onResumeQuiz(savedQuiz)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
        Resume {getQuizTitle(savedQuiz.quizType)} Quiz
      </button>
    </div>
  );
}
