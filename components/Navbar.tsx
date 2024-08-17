"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="relative w-full z-30 mt-6 md:bg-black/20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16 md:h-18 ">
        <div>
          <Link
            href={"/"}
            className="flex gap-1 items-center text-2xl"
          >
            <h1 className=" font-bold">
              Prep Me
            </h1>
          </Link>
        </div>

    

        <div className="flex items-center gap-3 justify-end">
          <UserMenu />
          <UserButton />
        </div>
      </div>
    </div>
    </header>
  );
};

export default Navbar;
