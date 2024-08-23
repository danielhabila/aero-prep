"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/prepMeWhite2.png";

const Navbar = () => {
  return (
    <header className="relative w-full z-30 mt-6 md:bg-black/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 ">
          <div>
            <Link href={"/"} className="flex gap-1 items-center text-xl">
              <Image src={logo} alt="Prep Me" width={38} height={38} />
            </Link>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Link
              className="text-white font-medium mr-5 underline"
              href="/stats"
            >
              My Stats
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
