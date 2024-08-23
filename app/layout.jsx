import { Raleway } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import LayoutProvider from "@/providers/LayoutProvider";
import { auth } from "@clerk/nextjs/server";

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
  const { userId } = auth();
  console.log("userId", userId);
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${raleway.className} min-h-screen`}>
          <LayoutProvider>{children}</LayoutProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
