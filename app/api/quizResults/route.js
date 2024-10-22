import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { results, email } = body;

  console.log("results", results);
  try {
    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (findUser) {
      let updatedResults = findUser.quizResults || [];

      if (updatedResults.length >= 10) {
        // Remove the oldest result
        updatedResults.shift();
      }

      // Add the new result
      updatedResults.push(results);

      // Update the user with the new results array
      await prisma.user.update({
        where: { email: findUser.email },
        data: {
          quizResults: updatedResults,
        },
      });
    } else {
      // Handle case where user is not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Quiz result saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { quizResults: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reverse the quizResults array to get the most recent result first
    const reversedResults = user.quizResults.reverse();

    return NextResponse.json(reversedResults, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
