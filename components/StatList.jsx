"use client";

import { useState, useEffect } from "react";
import StatItem from "@/components/StatItem.jsx";
import axios from "axios";
import Loader from "@/components/Loader.jsx";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function StatList() {
  const { user } = useUser();
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchQuizResults = async () => {
        try {
          const response = await axios.get("/api/quizResults", {
            params: { email: user.email },
          });
          setQuizResults(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setError(error);
          setIsLoading(false);
        }
      };

      fetchQuizResults();
    }
  }, [user]);

  if (error) {
    return (
      <div className="grid place-items-center h3 font-medium text-xl mt-20 text-gray-400">
        Error fetching data :(
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {isLoading ? (
          <div className="grid place-content-center">
            <Loader w={16} h={16} />
          </div>
        ) : quizResults.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Quiz Results Found</h2>
            <p className="mb-6">
              You haven't taken any quizzes yet. Start your first quiz now!
            </p>
            <Link
              href="/dashboard/subscriptions"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Take a Quiz
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-center mb-2 text-2xl  font-bold">
              <h1>Last 10 Results 📊</h1>
            </div>
            {quizResults.map((quizResult, index) => (
              <div className="py-1.5" key={index}>
                <StatItem quizResult={quizResult} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
