import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import StatCard from "./StatCard";
import { PortableText } from "@portabletext/react";

export default function StatItem({ quizResult }) {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const goToQuestion = (idx) => setActiveQuestion(idx);

  return (
    <Disclosure as="div" className="pt-3">
      {({ open }) => (
        <>
          <dt className="border-0 bg-[#191f24] rounded-md ring-1 ring-white/20 p-5">
            <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-100">
              <div className="flex flex-start space-x-4 w-full">
                <div className="grow">
                  <h2 className="font-semibold text-white mb-2">
                    <h1>{quizResult.examType || "No exam type"}</h1>
                  </h2>
                  <footer className="flex flex-wrap text-sm">
                    <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                      <span className="text-gray-300 text-[0.8rem]">
                        {quizResult.startTime
                          ? new Date(quizResult.startTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "No start time"}
                      </span>
                    </div>
                    <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                      <span className="text-gray-300 text-xs">
                        {quizResult.startTime
                          ? new Date(quizResult.startTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )
                          : "No start time"}{" "}
                        Local
                      </span>
                    </div>
                    <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                      <span className="text-gray-300 text-xs">
                        {quizResult.numberOfQuestions
                          ? `${quizResult.numberOfQuestions} Qs`
                          : "No number of questions"}
                      </span>
                    </div>
                  </footer>
                </div>
                <h1
                  title="Percentage"
                  className="flex items-center text-xl font-bold"
                >
                  {quizResult.scorePercentage
                    ? `${quizResult.scorePercentage}%`
                    : "No score percentage"}
                </h1>
              </div>
              <span className="ml-6 flex h-7 items-center">
                {open ? (
                  <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </span>
            </DisclosureButton>
          </dt>
          <DisclosurePanel
            as="dd"
            className="mt-2 py-2 md:px-12 px-4 ring-1 ring-white/20 rounded-md"
          >
            <div className="text-base text-gray-300">
              <div className="flex flex-col items-center mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                  <StatCard
                    title="Total Questions"
                    value={quizResult.numberOfQuestions}
                  />
                  <StatCard
                    title="Correct Answers"
                    value={quizResult.correctAnswers}
                  />
                  <StatCard
                    title="Wrong Answers"
                    value={quizResult.wrongAnswers}
                  />
                </div>
              </div>
              <div className="mt-10">
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                  {quizResult?.questions?.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToQuestion(idx)}
                      className={`w-8 h-8 rounded-full ${
                        question.selectedAnswer === question.correctAnswer
                          ? "bg-green-500"
                          : "bg-red-500"
                      } ${activeQuestion === idx ? "ring-2 ring-white" : ""} text-white font-bold`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-xl mb-5">
                    {quizResult?.questions?.[activeQuestion]?.question ||
                      "No question available"}
                  </p>
                  <ul>
                    {quizResult?.questions?.[activeQuestion]?.answers?.map(
                      (answer, idx) => (
                        <li
                          key={idx}
                          className={`mb-2 ${
                            answer ===
                            quizResult.questions[activeQuestion].correctAnswer
                              ? "text-green-500"
                              : answer ===
                                  quizResult.questions[activeQuestion]
                                    .selectedAnswer
                                ? "text-red-500"
                                : ""
                          }`}
                        >
                          {answer}
                          {answer ===
                            quizResult.questions[activeQuestion]
                              .selectedAnswer &&
                            answer !==
                              quizResult.questions[activeQuestion]
                                .correctAnswer && (
                              <span className="ml-2 text-red-500">
                                (Your answer)
                              </span>
                            )}
                        </li>
                      )
                    )}
                  </ul>
                  {quizResult.questions &&
                    quizResult.questions[activeQuestion] &&
                    quizResult.questions[activeQuestion].explanation && (
                      <div className="mt-4 text-left">
                        <h4 className="font-bold mb-2">Explanation:</h4>
                        <PortableText
                          value={
                            quizResult.questions[activeQuestion].explanation
                          }
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
