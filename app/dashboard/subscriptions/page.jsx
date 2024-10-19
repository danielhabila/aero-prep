"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";
import Image from "next/image";
// import pplStudentImage from "../../../public/images/prepMeWhite2.png";
import QuizModal from "@/components/quizModal";
import firstSoloImage from "../../../public/images/first-solo.jpeg";
import pplStudentImage from "../../../public/images/ppl-student.png";
import QuizComponent from "@/components/QuizComponent";

export default function SubscriptionsPage() {
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const { user, isLoading } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get("/api/updateSubscription", {
            params: { email: user.email },
          });
          setSubscriptions(response.data.subscriptions);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        } finally {
          setIsLoadingSubscriptions(false);
        }
      }
    };

    if (!isLoading) {
      fetchSubscriptions();
    }
  }, [user, isLoading]);

  const startQuiz = async (quizType) => {
    try {
      const count = quizType === "pstar" ? 50 : 25;
      const response = await axios.get("/api/getQuizQuestions", {
        params: { type: quizType, count: count },
      });
      setQuizQuestions(response.data);
      setShowQuiz(true);
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

  if (showQuiz) {
    const getQuizTitle = (quizType) => {
      switch (quizType) {
        case "pstar":
          return "PSTAR";
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
      />
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
    <div className="w-full mx-auto flex flex-wrap justify-evenly items-stretch gap-8 lg:px-4 py-8">
      {subscriptions.map((subscription) => (
        <div
          key={subscription}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-2xl"
        >
          <div className="h-full flex flex-col border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-500">
            <div className="relative h-64">
              <Image
                className="w-full h-full object-cover transition duration-700 ease-out transform hover:scale-110"
                src={
                  subscription === "pstar"
                    ? "https://images.unsplash.com/photo-1518228684816-9135c15ab4ea?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    : "https://images.unsplash.com/photo-1501821221140-a47f57e8940d?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                width={400}
                height={300}
                alt={`${subscription.toUpperCase()} Quiz`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {
                    // setSelectedQuiz(subscription);
                    setSelectedQuiz("airlaw");
                    setOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-semibold text-lg hover:bg-blue-600 transition duration-300"
                >
                  Take Quiz
                </button>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <h3 className="font-bold text-2xl text-gray-100 mb-4">
                {subscription.toUpperCase()} Quiz
              </h3>
              <p className="text-gray-400 text-md mb-6">
                Test your knowledge on {subscription.toUpperCase()} topics.
              </p>
              <button
                onClick={() => {
                  setSelectedQuiz(subscription);
                  setOpen(true);
                }}
                className="text-blue-500 hover:text-blue-400 font-semibold text-lg transition duration-300"
              >
                Take Quiz &rarr;
              </button>
            </div>
          </div>
        </div>
      ))}
      <QuizModal
        open={open}
        setOpen={setOpen}
        selectedQuiz={selectedQuiz}
        onStartQuiz={(quizType) => {
          setSelectedQuiz(quizType);
          startQuiz(quizType);
        }}
      />
    </div>
  );
}
