import { Raleway } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import LayoutProvider from "./providers/LayoutProvider";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

export const metadata = {
  title: "AeroPrep",
  description: "Pass your TC exams in days not months",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body
          suppressHydrationWarning
          className={`${raleway.className} min-h-screen flex flexCol justify-between`}
        >
          <LayoutProvider>{children}</LayoutProvider>
        </body>
      </html>
    </UserProvider>
  );
}
