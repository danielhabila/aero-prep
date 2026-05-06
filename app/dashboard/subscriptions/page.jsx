"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import Image from "next/image";
import QuizModal from "@/components/quizModal";
import QuizComponent from "@/components/QuizComponent";
import ResumeQuizButton from "@/components/ResumeQuizButton";

const ALL_QUIZZES = [
  { type: "pstar" },
  { type: "rocA" },
  { type: "inratMello" },
  { type: "ppl" },
  { type: "ncaaAirlaw" },
];

export default function SubscriptionsPage() {
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [email, setEmail] = useState(null);
  const subscriptions = ALL_QUIZZES;
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [savedQuiz, setSavedQuiz] = useState(null);
  const [error, setError] = useState(false);
  const [initialQuizState, setInitialQuizState] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await axios.get("/api/me");
        setEmail(me.data.email);
        setError(false);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(true);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };
    init();
  }, []);

  const startQuiz = async (
    quizType,
    savedQuizData = null,
    studyMode = false
  ) => {
    try {
      if (savedQuizData) {
        setQuizQuestions(savedQuizData.questions);
        setShowQuiz(true);
        setSelectedQuiz(savedQuizData.quizType);
        setInitialQuizState({
          activeQuestion: savedQuizData.activeQuestion,
          results: savedQuizData.results,
          quizStartTime: savedQuizData.quizStartTime,
          studyMode: savedQuizData.studyMode ?? false,
          answeredQuestions: savedQuizData.answeredQuestions ?? [],
          saveId: savedQuizData.id,
        });
      } else {
        const count =
          quizType === "pstar"
            ? 50
            : quizType === "rocA"
              ? 25
              : quizType === "inratMello"
                ? 50
                : quizType === "ncaaAirlaw"
                  ? 25
                  : quizType === "full"
                    ? 100
                    : 25;

        const response = await axios.get("/api/getQuizQuestions", {
          params: { type: quizType, count: count },
        });
        if (!Array.isArray(response.data) || response.data.length === 0) {
          alert(
            "No questions are available for this quiz yet. Check back soon."
          );
          return;
        }
        setQuizQuestions(response.data);
        setShowQuiz(true);
        setSelectedQuiz(quizType);
        setInitialQuizState({ studyMode: studyMode });
      }
    } catch (err) {
      console.error("Error fetching quiz questions:", err);
    }
  };

  const exitQuiz = () => {
    setShowQuiz(false);
    setQuizQuestions([]);
    setSelectedQuiz("");
  };

  if (isLoadingSubscriptions) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  if (showQuiz) {
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
          return "PPL Complete Exam";
        case "inratMello":
          return "INRAT";
        case "ncaaAirlaw":
          return "NCAA Airlaw";
        default:
          return `${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Quiz`;
      }
    };

    return (
      <QuizComponent
        questions={quizQuestions}
        email={email}
        quizType={selectedQuiz}
        title={getQuizTitle(selectedQuiz)}
        onExit={exitQuiz}
        initialState={initialQuizState}
        studyMode={initialQuizState?.studyMode}
      />
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4 text-gray-400">
          Error fetching data :(
        </h2>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No Active Subscriptions</h2>
        <p>You are not currently subscribed to any quizzes.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <ResumeQuizButton
        email={email}
        onResumeQuiz={(saved) => startQuiz(null, saved)}
      />
      <div className="flex flex-col lg:flex-row justify-center items-center gap-4 flex-wrap">
        {subscriptions.map((subscription) => (
          <div key={subscription.type} className="w-full max-w-sm">
            <div className="h-full flex flex-col border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-500">
              <div className="relative h-64">
                <Image
                  className="w-full h-full"
                  src={
                    subscription.type === "pstar"
                      ? "https://images.unsplash.com/photo-1518228684816-9135c15ab4ea?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      : subscription.type === "rocA"
                        ? "https://images.unsplash.com/photo-1623945253439-f77e7591f9c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        : subscription.type === "ncaaAirlaw"
                          ? "https://ncaa.gov.ng/media/2p5achot/ways-to-give_1723795719549.jpg?width=770&height=440&v=1db13387d8ed2d0"
                          : "https://images.unsplash.com/photo-1501821221140-a47f57e8940d?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  width={400}
                  height={300}
                  alt={`${subscription.type.toUpperCase()} Quiz`}
                />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <h3 className="font-bold text-2xl text-gray-100 mb-4">
                  {subscription.type === "rocA"
                    ? "ROC-A Quiz"
                    : subscription.type === "inratMello"
                      ? "INRAT Quiz"
                      : subscription.type === "ncaaAirlaw"
                        ? "NCAA Airlaw Quiz"
                        : `${subscription.type.toUpperCase()} Quiz`}
                </h3>
                <p className="text-gray-400 text-md mb-6">
                  Test your knowledge on{" "}
                  {subscription.type === "rocA"
                    ? "ROC-A"
                    : subscription.type === "inratMello"
                      ? "INRAT"
                      : subscription.type === "ncaaAirlaw"
                        ? "NCAA Airlaw"
                        : subscription.type.toUpperCase()}{" "}
                  topics.
                </p>
                <button
                  onClick={() => {
                    setSelectedQuiz(subscription.type);
                    setOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-400 font-semibold text-lg transition duration-300"
                >
                  Start Quiz &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <QuizModal
        open={open}
        setOpen={setOpen}
        selectedQuiz={selectedQuiz}
        savedQuiz={savedQuiz}
        onStartQuiz={(quizType, resume, studyMode) => {
          setSelectedQuiz(quizType);
          startQuiz(quizType, resume, studyMode);
        }}
      />
    </div>
  );
}
