import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { username, email } = body;
  console.log(
    `username from checkUser: ${username}, email from checkUser: ${email}`
  );

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    } else {
      //create new user
      await prisma.user.create({
        data: {
          username,
          email,
        },
      });
      return NextResponse.json({ message: "User created" }, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
