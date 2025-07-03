import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.warn(
        "[API/JOBS/MY_JOBS_GET] Unauthorized attempt to fetch client jobs."
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const client = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });
   
    const clientJobs = await prisma.job.findMany({
      where: {
        clientId: client?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clientJobs);
  } catch (error) {
    console.error("[API/JOBS/MY_JOBS_GET] Error fetching client jobs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
