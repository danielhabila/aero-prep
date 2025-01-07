"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";
import Image from "next/image";
import QuizModal from "@/components/quizModal";
import QuizComponent from "@/components/QuizComponent";
import { useRouter } from "next/navigation";
import ResumeQuizButton from "@/components/ResumeQuizButton";

export default function SubscriptionsPage() {
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const { user, isLoading } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const router = useRouter();
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [savedQuiz, setSavedQuiz] = useState(null);
  const [error, setError] = useState(false);
  const [initialQuizState, setInitialQuizState] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      if (user && user.email) {
        try {
          // First ensure user exists in database and get the response
          const userResponse = await axios.post("/api/checkUser", {
            username: user.nickname,
            email: user.email,
          });

          // Only fetch subscriptions if user creation/verification was successful
          if (userResponse.status === 200 || userResponse.status === 201) {
            const subsResponse = await axios.get("/api/check-subscription", {
              params: { email: user.email },
            });
            setSubscriptions(subsResponse.data.subscriptions);
            setError(false);
          }
        } catch (error) {
          console.error(
            "Error initializing user or fetching subscriptions:",
            error
          );
          setError(true);
        } finally {
          setIsLoadingSubscriptions(false);
        }
      }
    };

    const verifyStripeSession = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );
      if (sessionId && user) {
        setVerifyingPayment(true);
        try {
          const response = await axios.get("/api/verify-session", {
            params: { session_id: sessionId, email: user.email },
          });
          if (response.status === 200) {
            await initializeUser();
          }
        } catch (error) {
          console.error("Error verifying Stripe session:", error);
        } finally {
          setVerifyingPayment(false);
          router.replace("/dashboard/subscriptions");
        }
      }
    };

    const fetchSavedQuizProgress = async (quizType) => {
      try {
        const response = await axios.get("/api/quizProgress", {
          params: { email: user.email, quizType },
        });
        setSavedQuiz(response.data);
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error("Error fetching saved quiz progress:", error);
        }
      }
    };

    if (!isLoading) {
      initializeUser();
      verifyStripeSession();
    }
  }, [user, isLoading, router]);

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
          studyMode: studyMode,
        });
      } else {
        const count =
          quizType === "pstar"
            ? 50
            : quizType === "rocA"
              ? 25
              : quizType === "inratMello"
                ? 50
                : quizType === "full"
                  ? 100
                  : 25;

        const response = await axios.get("/api/getQuizQuestions", {
          params: { type: quizType, count: count },
        });
        setQuizQuestions(response.data);
        setShowQuiz(true);
        setSelectedQuiz(quizType);
        setInitialQuizState({ studyMode: studyMode });
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const exitQuiz = () => {
    setShowQuiz(false);
    setQuizQuestions([]);
    setSelectedQuiz("");
  };

  if (isLoading || isLoadingSubscriptions) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  if (verifyingPayment) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
        <p className="ml-2">Verifying payment...</p>
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
        default:
          return `${quizType.charAt(0).toUpperCase() + quizType.slice(1)} Quiz`;
      }
    };

    return (
      <QuizComponent
        questions={quizQuestions}
        email={user.email}
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
        <Link
          href="/dashboard/purchase"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Subscribe to a quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <ResumeQuizButton
        email={user.email}
        onResumeQuiz={(savedQuiz) => startQuiz(null, savedQuiz)}
      />
      <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
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
                      : `${subscription.type.toUpperCase()} Quiz`}
                </h3>
                <p className="text-gray-400 text-md mb-6">
                  Test your knowledge on{" "}
                  {subscription.type === "rocA"
                    ? "ROC-A"
                    : subscription.type === "inratMello"
                      ? "INRAT"
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
