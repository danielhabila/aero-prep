"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export const fetchUsers = async () => {
  const { user } = await getSession();
  try {
  } catch (error) {
    console.log(error);
  }
};
