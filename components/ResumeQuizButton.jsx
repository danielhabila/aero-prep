"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const QUIZ_TITLES = {
  pstar: "PSTAR",
  rocA: "ROC-A",
  inratMello: "INRAT",
  ncaaAirlaw: "NCAA Airlaw",
  ppl: "PPL",
  full: "PPL Complete",
  pplAirlawPtca: "PPL Airlaw",
  pplMetPtca: "PPL Meteorology",
  pplGenPtca: "PPL General Knowledge",
  pplNavPtca: "PPL Navigation",
};

function formatSavedAt(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ResumeQuizButton({ email, onResumeQuiz }) {
  const [saves, setSaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    axios
      .get("/api/quizProgress", { params: { email } })
      .then((res) => setSaves(res.data.quizSaves ?? []))
      .catch((err) => {
        if (err.response?.status !== 404) console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [email]);

  const dismiss = async (id) => {
    const previous = saves;
    setSaves((prev) => prev.filter((s) => s.id !== id));
    try {
      await axios.delete("/api/quizProgress", { params: { email, id } });
    } catch (err) {
      console.error("Error deleting save:", err);
      setSaves(previous);
    }
  };

  if (isLoading || saves.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3">
        Saved Quizzes
      </h3>
      <div className="flex flex-col gap-2">
        {saves.map((save) => (
          <div
            key={save.id}
            className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-100">
                {QUIZ_TITLES[save.quizType] ?? save.quizType} Quiz
              </span>
              <span className="text-gray-400 text-sm">
                {save.studyMode ? "Study Mode · " : ""}
                Q{save.activeQuestion + 1}/{save.questions?.length ?? "?"} ·{" "}
                {formatSavedAt(save.savedAt)}
              </span>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => onResumeQuiz(save)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </button>
              <button
                onClick={() => dismiss(save.id)}
                className="text-gray-500 hover:text-red-400 transition"
                aria-label="Dismiss saved quiz"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
