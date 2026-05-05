import { NextResponse } from "next/server";
import { getCurrentUserEmail } from "@/lib/session";

export async function GET() {
  const email = getCurrentUserEmail();
  return NextResponse.json({ email });
}
