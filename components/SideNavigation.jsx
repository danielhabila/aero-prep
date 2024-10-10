"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RectangleStackIcon, UsersIcon } from "@heroicons/react/24/outline";
import logo from "../public/images/prepMeWhite2.png";

const navigation = [
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: RectangleStackIcon,
  },
  { name: "Stats", href: "/dashboard/stats", icon: UsersIcon },
];

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-900 text-white p-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href={"/"}>
          <Image src={logo} alt="PrepMe" className="h-8 w-auto" />
        </Link>
      </div>
      <ul>
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-lg ${
                pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-6 w-6 mr-3" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
