import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser || dbUser.role !== "FREELANCER") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const jobs = await prisma.job.findMany({
    where: {
      requiredSkills: {
        hasSome: dbUser.skills,
      },
      assignedFreelancerId: null,
      proposals: {
        none: {
          freelancerId: dbUser.id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}
