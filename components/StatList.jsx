"use client";

import { useState, useEffect } from "react";
import StatItem from "@/components/StatItem.jsx";
import axios from "axios";
import Loader from "@/components/Loader.jsx";
import { useUser } from "@auth0/nextjs-auth0/client";

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
      <div className="grid place-items-center h3 mt-20 text-gray-400">
        Error fetching data :(
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid place-content-center">
            <Loader w={16} h={16} />
          </div>
        ) : (
          <div>
            {quizResults &&
              quizResults.map((quizResult, index) => (
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
