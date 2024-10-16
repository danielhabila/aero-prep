import Link from "next/link";
import Image from "next/image";

const Hero = () => {
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
        <div className="px-4 md:px-6 max-w-[1500px] mx-auto w-[90%]">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Pass your TC exams in weeks not months
            </h1>
            <p className="text-gray-200 text-xl py-4">Start practicing now!</p>
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
      </div>
    </div>
  );
};

export default Hero;
