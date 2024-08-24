import { Raleway } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

export const metadata = {
  title: "PrepMe",
  description: "Pass your TC exams with ease",
  icons: {
    icon: "/prepMeFavicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body
          className={`${raleway.className} min-h-screen flex flexCol justify-between`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}
