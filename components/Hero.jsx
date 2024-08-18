import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center text-center ">
      <div className="px-4 md:px-6 max-w-[1500px] mx-auto w-[90%]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
            Pass your TC PPL exam
          </h1>
          <p className="text-gray-200 text-xl py-4">
            Start practicing now!
          </p>
        </div>
        <div className="mt-6">
          <Link
            href={"/quiz"}
            className=" px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
          >
            I'm ready
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
