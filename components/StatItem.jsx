import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import RenderResults from "./RenderResults";
import { PortableText } from "@portabletext/react";

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
          className="text-blue-500 hover:underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default function StatItem({ quizResult }) {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const transformedData = {
    results: {
      answers: quizResult.questions.map((q) => ({
        selectedAnswer: q.selectedAnswer,
        correctAnswer: q.correctAnswer,
      })),
    },
    questions: quizResult.questions,
  };

  const getQuizType = (examType) => {
    switch (examType) {
      case "PSTAR Exam":
        return "pstar";
      case "PPL Airlaw Exam":
        return "pplAirlawPtca";
      case "PPL Meteorology Exam":
        return "pplMetPtca";
      case "PPL General Knowledge Exam":
        return "pplGenPtca";
      case "PPL Navigation Exam":
        return "pplNavPtca";
      case "PPL Complete Exam":
        return "full";
      default:
        return "other";
    }
  };

  return (
    <Disclosure as="div" className="pt-3">
      {({ open }) => (
        <>
          <dt className="border-0 bg-slate-800/40 rounded-md ring-1 ring-white/20 p-5 odd:bg-gradient-to-tr from-gray-900 to-gray-800">
            <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-100">
              <div className="flex flex-start space-x-4 w-full">
                <div className="grow">
                  <h2 className="font-semibold text-white mb-2">
                    {quizResult.examType || "No exam type"}
                  </h2>
                  <footer className="flex flex-wrap text-sm">
                    <div className="flex items-center after:block after:content-['·'] last:after:content-[''] after:text-sm after:text-slate-300 after:px-2">
                      <span className="text-gray-300 text-[0.8rem]">
                        {quizResult.startTime
                          ? new Date(quizResult.startTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
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
                          : "No start time"}
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
                <div className="flex  space-x-2">
                  <h1 title="Percentage" className="flex  text-xl font-bold">
                    {quizResult.scorePercentage !== undefined &&
                    quizResult.scorePercentage !== null
                      ? quizResult.scorePercentage === 0
                        ? "0%"
                        : `${quizResult.scorePercentage}%`
                      : "N/A"}
                  </h1>
                  <span className="flex pl-3 h-7 justify-center items-center">
                    {open ? (
                      <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                </div>
              </div>
            </DisclosureButton>
          </dt>
          <DisclosurePanel
            as="dd"
            className="mt-2 py-8 md:px-12 px-4 ring-1 ring-white/20 rounded-md bg-slate-800/20"
          >
            <RenderResults
              results={transformedData.results}
              questions={transformedData.questions}
              quizType={getQuizType(quizResult.examType)}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              components={components}
              onExit={() => {}}
              fetchNewQuiz={() => {}}
              isStats={true}
            />
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
