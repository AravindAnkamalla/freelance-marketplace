import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/types";

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || dbUser.role !== UserRole.CLIENT) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const jobToDelete = await prisma.job.findUnique({
      where: {
        id: params.jobId,
        clientId: dbUser.id,
      },
    });

    if (!jobToDelete) {
      return new NextResponse("Job not found or not owned by client", {
        status: 404,
      });
    }

    await prisma.job.delete({
      where: { id: params.jobId },
    });

    revalidatePath("/client/dashboard/my-jobs");
    revalidatePath("/freelancer/dashboard/browse-jobs");

    return new NextResponse("Job deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[API/JOBS/[jobId]/DELETE] Error deleting job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = await params.jobId;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || dbUser.role !== UserRole.CLIENT) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const values = await req.json();

    if (
      !values.title ||
      !values.description ||
      !values.budget ||
      !values.requiredSkills
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId,
        clientId: dbUser.id,
      },
    });

    if (!existingJob) {
      return new NextResponse("Job not found or not owned by client", {
        status: 404,
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: values.title,
        description: values.description,
        budget: parseFloat(values.budget),
        status: values.status || existingJob.status,
        requiredSkills: values.requiredSkills,
        deadline: values.deadline ? new Date(values.deadline) : null,
      },
    });

    revalidatePath(`/client/dashboard/my-jobs`);
    revalidatePath(`/client/jobs/${jobId}`);

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("[API/JOBS/[jobId]/PATCH] Error updating job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId  = await params.jobId;
  try {
    const jobDetails = await prisma.job.findFirst({
      where: {
        id: jobId,
      },
    });
    return NextResponse.json(jobDetails);
  } catch (error) {
    console.error("[API/JOBS/[jobId]/PATCH] Error updating job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
