
'use server'; 
import { auth } from '@clerk/nextjs/server'; 
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db'; 
import { CreateJobData, JobStatus, UserRole } from '@/types';




/**
 * Server Action to create a new job in the database.
 * This function runs exclusively on the server.
 * @param data - The job details submitted by the client.
 * @returns An object indicating success or containing an error message.
 */
export async function createJob(data: CreateJobData) {
  try {
    const { userId } = await  auth(); // Get the authenticated Clerk user's ID from the server context.

    if (!userId) {
      // If no user is authenticated, return an error.
      return { error: 'You must be logged in to post a job.' };
    }

    // Fetch the internal user record to verify their role.
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Authorization check: Ensure the user exists in our DB and has the CLIENT role.
    if (!dbUser || dbUser.role !== UserRole.CLIENT) {
      return { error: 'You are not authorized to post jobs (Client role required).' };
    }

    // Create the new job record in the database using Prisma.
    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        requiredSkills: data.requiredSkills,
        // deadline: data.deadline, // Uncomment if you add deadline to the form
        clientId: dbUser.id, // Link the job to the internal client ID
        status: JobStatus.OPEN, // Set initial status as OPEN using the enum
      },
    });

    // Revalidate specific paths to ensure Next.js's data cache is updated.
    // This makes sure new jobs appear instantly on relevant pages.
    revalidatePath('/client/jobs');         // For the client's own job list
    revalidatePath('/freelancer/browse-jobs'); // For the freelancer's job Browse list

    return { success: true, job: newJob }; // Return success and the created job data

  } catch (error: any) {
    console.error('Error in createJob Server Action:', error);
    // Return a user-friendly error message.
    return { error: error.message || 'Failed to post job. Please try again.' };
  }
}