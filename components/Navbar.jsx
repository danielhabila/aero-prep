"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/prepMeWhite2.png";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    const handleCheckUserDB = async () => {
      try {
        const response = await axios.post("/api/checkUser", {
          username: user.nickname,
          email: user.email,
        });

        if (response.status === 200) {
          alert("Welcome back");
        } else if (response.status === 201) {
          alert("Welcome new user");
        } else if (response.status === 500) {
          alert("Something went wrong server side, please try again.");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        alert("Something went wrong, please try again.");
        console.log(error.message);
      }
    };

    if (user && !isLoading) {
      handleCheckUserDB();
    }
  }, [user, isLoading]);

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
            {user && (
              <Link
                className="text-white font-medium mr-2 underline"
                href="/stats"
              >
                My Stats
              </Link>
            )}
            {/* <UserButton /> */}

            <ul className="flex grow justify-end flex-wrap items-center">
              <li className="ml-3 sm:ml-6 inline ">
                {!user ? (
                  <a
                    className="rounded-full px-4 py-1 inline-flex items-center bg-white font-medium hover:bg-white/80 group text-black"
                    href="/api/auth/login"
                  >
                    Login{" "}
                    <span className="tracking-normal text-blue-950 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                      -&gt;
                    </span>
                  </a>
                ) : (
                  <div className="flex grow justify-end flex-wrap items-center">
                    <Link
                      className="text-white font-medium text-sm hover:underline"
                      href="/account"
                    >
                      {user.nickname}
                    </Link>
                    <a
                      className="px-4 py-1 ml-4 rounded-full inline-flex items-center text-black font-medium bg-white hover:bg-white/80 group"
                      href="/api/auth/logout"
                    >
                      Logout!
                    </a>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
