import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; 
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@/types';

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || dbUser.role !== UserRole.CLIENT) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const jobToDelete = await prisma.job.findUnique({
      where: {
        id: params.jobId,
        clientId: dbUser.id,
      },
    });

    if (!jobToDelete) {
      return new NextResponse('Job not found or not owned by client', { status: 404 });
    }

    await prisma.job.delete({
      where: { id: params.jobId },
    });

    revalidatePath('/dashboard/my-jobs');
    revalidatePath('/freelancer/browse-jobs');

    return new NextResponse('Job deleted successfully', { status: 200 });

  } catch (error) {
    console.error('[API/JOBS/[jobId]/DELETE] Error deleting job:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
