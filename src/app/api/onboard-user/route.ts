import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { UserRole } from "@/types/index";



export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { clerkId, email, name, profilePicture, role } = body;

    if (
      !clerkId ||
      !email ||
      !role ||
      (role !== UserRole.CLIENT && role !== UserRole.FREELANCER)
    ) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (existingUser && existingUser.role) {
      return NextResponse.json(
        { message: "User already onboarded." },
        { status: 200 }
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: clerkId },
      update: {
        email: email,
        name: name,
        profilePicture: profilePicture,
        role: role,
      },
      create: {
        clerkId: clerkId,
        email: email,
        name: name,
        profilePicture: profilePicture,
        role: role,
        balance: 0,
      },
    });

    return NextResponse.json(
      { message: "User onboarded successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error onboarding user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
