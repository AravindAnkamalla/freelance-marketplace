
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client"; 

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      email,
      name,
      profilePicture,
      role,
      skills,
      bio,
      hourlyRate,
    } = body;

    if (!email || !role || !Object.values(UserRole).includes(role)) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser?.role) {
      return NextResponse.json(
        { message: "User already onboarded." },
        { status: 200 }
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name,
        profilePicture,
        role,
        skills: role === "FREELANCER" ? skills || [] : [],
        bio: role === "FREELANCER" ? bio || null : null,
        hourlyRate:
          role === "FREELANCER" && hourlyRate
            ? parseFloat(hourlyRate)
            : null,
      },
      create: {
        clerkId: userId,
        email,
        name,
        profilePicture,
        role,
        balance: 0,
        skills: role === "FREELANCER" ? skills || [] : [],
        bio: role === "FREELANCER" ? bio || null : null,
        hourlyRate:
          role === "FREELANCER" && hourlyRate
            ? parseFloat(hourlyRate)
            : null,
      },
    });

    return NextResponse.json(
      { message: "User onboarded successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API/ONBOARD_USER_POST] Error onboarding user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
