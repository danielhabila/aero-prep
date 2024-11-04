"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Loader from "@/components/Loader";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        router.push("/dashboard/purchase");
        return;
      }

      try {
        const response = await axios.get("/api/verify-session", {
          params: {
            session_id: sessionId,
            email: searchParams.get("email"),
          },
        });

        if (response.status === 200) {
          setIsVerifying(false);
        } else {
          router.push("/dashboard/purchase");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        router.push("/dashboard/purchase");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
        <p className="mt-4 text-gray-400">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 md:py-24 px-4">
      <div className="flex flex-col items-center justify-center space-y-10 p-16 shadow-lg rounded-lg bg-black/30">
        <CheckCircleIcon className="h-14 w-14 text-green-500" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center">
          Payment successful
        </h1>
        <p className="max-w-[600px] text-center text-gray-400 md:text-xl/relaxed">
          Your transaction has been successfully completed. Thank you for your
          purchase.
        </p>
        <a
          href="/dashboard/subscriptions"
          className="rounded-md border text-black border-gray-200 bg-white hover:bg-gray-100 px-4 py-1.5"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
