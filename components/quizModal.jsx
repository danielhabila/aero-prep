import { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import logo from "../images/indiees-logo.png";

export default function QuizModal({
  open,
  setOpen,
  selectedQuiz,
  onStartQuiz,
  savedQuiz,
}) {
  const [studyMode, setStudyMode] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 p-5 shadow-2xl transition-all sm:my-8 w-full h-[80vh] m-4 sm:mx-8 sm:p-6 flex flex-col justify-center gap-4">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-white hover:text-white/70 focus:outline-none focus:ring-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium font-cabinet-grotesk text-white mb-6"
                  >
                    {selectedQuiz === "pstar"
                      ? "PSTAR Quiz"
                      : "PPL Quiz Options"}
                  </Dialog.Title>
                </div>

                <div className="mb-6 flex justify-center">
                  <div className="bg-gray-800 p-1 rounded-lg">
                    <button
                      className={`px-4 py-2 rounded-md transition-all ${
                        !studyMode ? "bg-blue-500 text-white" : "text-gray-300"
                      }`}
                      onClick={() => setStudyMode(false)}
                    >
                      Exam Mode
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md transition-all ${
                        studyMode ? "bg-green-500 text-white" : "text-gray-300"
                      }`}
                      onClick={() => setStudyMode(true)}
                    >
                      Study Mode
                    </button>
                  </div>
                </div>

                {selectedQuiz === "pstar" ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      onStartQuiz("pstar", null, studyMode);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center w-full md:w-4/6 mx-auto"
                  >
                    Start PSTAR Quiz
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 w-full md:w-4/6 mx-auto">
                    <button
                      onClick={() => {
                        setOpen(false);
                        onStartQuiz("pplAirlawPtca", null, studyMode);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center"
                    >
                      Airlaw (25 Questions)
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        onStartQuiz("pplMetPtca", null, studyMode);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center"
                    >
                      Meteorology (25 Questions)
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        onStartQuiz("pplGenPtca", null, studyMode);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-center"
                    >
                      General Knowledge (25 Questions)
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        onStartQuiz("pplNavPtca", null, studyMode);
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center"
                    >
                      Navigation (25 Questions)
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        onStartQuiz("full", null, studyMode);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center col-span-full"
                    >
                      Full PPL Quiz (100 Questions)
                    </button>
                  </div>
                )}

                {savedQuiz && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      onStartQuiz(selectedQuiz, true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-center mb-4"
                  >
                    Resume Quiz
                  </button>
                )}
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
