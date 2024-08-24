import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { results } = body;

  try {
    const findUser = await prisma.user.findUnique({
      where: { email: "johanoumar1@gmail.com" },
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
