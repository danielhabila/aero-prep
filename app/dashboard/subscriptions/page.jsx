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
      const response = await axios.get("/api/getQuizQuestions", {
        params: { type: quizType, count: 50 },
      });
      setQuizQuestions(response.data);

      setShowQuiz(true);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
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
    <div className="max-w-2xl mx-auto grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-none items-start pb-6">
      {subscriptions.map((subscription) => (
        <div key={subscription} className="h-full flex flex-col">
          <div className="mb-4">
            <a
              className="block group overflow-hidden"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedQuiz(subscription);
                setOpen(true);
              }}
            >
              <Image
                className="w-full aspect-[101/64] object-cover group-hover:scale-105 transition duration-700 ease-out"
                src={
                  subscription === "pstar" ? firstSoloImage : pplStudentImage
                }
                width="202"
                height="128"
                alt={`${subscription.toUpperCase()} Quiz`}
              />
            </a>
          </div>
          <div className="grow text-center">
            <a
              className="font-cabinet-grotesk font-bold text-gray-100 hover:text-blue-500 transition duration-150 ease-in-out"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedQuiz(subscription);
                setOpen(true);
              }}
            >
              {subscription.toUpperCase()} Quiz
            </a>
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
