"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/prepMeWhite2.png";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleCheckUserDB = async () => {
      try {
        const response = await axios.post("/api/checkUser", {
          username: user.nickname,
          email: user.email,
        });

        if (response.status === 200) {
          // alert("Welcome back");
        } else if (response.status === 201) {
          // alert("Welcome new user");
        } else if (response.status === 500) {
          alert("Something went wrong server side, please report issue.");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        alert("Something went wrong, please report issue.");
        console.log(error.message);
      }
    };

    if (user && !isLoading) {
      handleCheckUserDB();
    }
  }, [user, isLoading]);

  return (
    <header
      className={`w-full z-30 mt-6 md:bg-black/50 ${pathname === "/" ? "absolute" : "relative"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 ">
          <div>
            <Link href={"/"} className="flex gap-1 items-center text-xl">
              <Image src={logo} alt="Prep Me" className="w-9 md:w-10" />
            </Link>
          </div>

          <div className="flex items-center gap-3 justify-end">
            {user && (
              <Link
                className="text-white font-semibold mr-2 hover:underline"
                href="/stats"
              >
                My Stats
              </Link>
            )}
            {/* <UserButton /> */}

            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
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
                  <a
                    className="px-4 py-1 rounded-full inline-flex items-center text-black font-medium bg-white hover:bg-white/80 group"
                    href="/api/auth/logout"
                  >
                    Logout!
                  </a>
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
