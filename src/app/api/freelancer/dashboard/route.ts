import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const assignedJobs = await prisma.job.findMany({
    where: { assignedFreelancerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const proposals = await prisma.proposal.findMany({
    where: { freelancerId: user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assignedJobs, proposals });
}
