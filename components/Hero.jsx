"use client";

import Image from "next/image";

const Hero = () => {
  const handleScroll = () => {
    const pricingSection = document.getElementById("pricingPstar");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <Image
        src="https://images.pexels.com/photos/6894103/pexels-photo-6894103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Background Image"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className="opacity-30"
      />
      <div className="absolute inset-0 bg-[#111827] opacity-70"></div>
      <div className="relative z-10 text-center text-white">
        <div className="px-4 md:px-6 max-w-[1500px] mx-auto sm:w-[90%]">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Pass your TC exams in days not months
            </h1>
            <p className="text-gray-200 text-xl py-4">
              Save time and practice questions that will appear on the actual
              exam.
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleScroll}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              PSTAR
            </button>
            <button
              onClick={handleScroll}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              ROC-A
            </button>
            <button
              onClick={handleScroll}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              PPL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
