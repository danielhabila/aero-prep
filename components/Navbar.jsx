"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/prepMeWhite2.png";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setEmail(data.email);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

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
            {email && (
              <Link
                className="text-white font-semibold mr-2 hover:underline"
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}

            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                {loaded && !email ? (
                  <Link
                    className="rounded-full px-4 py-1 inline-flex items-center bg-white font-medium hover:bg-white/80 group text-black"
                    href="/login"
                  >
                    Login{" "}
                    <span className="tracking-normal text-blue-950 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                      -&gt;
                    </span>
                  </Link>
                ) : email ? (
                  <a
                    className="px-4 py-1 rounded-full inline-flex items-center text-black font-medium bg-white hover:bg-white/80 group"
                    href="/api/logout"
                  >
                    Logout
                  </a>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
