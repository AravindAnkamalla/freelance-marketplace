
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client'; 

interface JobDetailsPageProps {
  params: {
    jobId: string; 
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const  jobId  = params.jobId;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser || dbUser.role !== UserRole.CLIENT) {
    redirect('/client/dashboard'); 
  }


  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
      clientId: dbUser.id, 
    },
  });

  if (!job) {
    
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <h1 className="text-3xl font-bold mb-4">Job Not Found or Unauthorized Access</h1>
        <p>The job you are looking for does not exist or you do not have permission to view it.</p>
        <a href="/client/my-jobs" className="mt-4 inline-block text-blue-600 hover:underline">Back to My Jobs</a>
      </div>
    );
  }

  return (
    <main className="container m-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-6">{job.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 font-semibold">Budget:</p>
            <p className="text-lg">${job.budget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Status:</p>
            <p className="text-lg">{job.status}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Required Skills:</p>
            <p className="text-lg">{job.requiredSkills.join(', ')}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Posted On:</p>
            <p className="text-lg">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          {job.deadline && (
            <div>
              <p className="text-gray-600 font-semibold">Deadline:</p>
              <p className="text-lg">{new Date(job.deadline).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
          <a href={`/client/jobs/${job.id}/edit`} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            Edit Job
          </a>
          {/* Delete button will be a Client Component with useMutation */}
          <button className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Delete Job (Coming Soon)
          </button>
          <a href="/client/dashboard/my-jobs" className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            Back to My Jobs
          </a>
        </div>
      </div>
    </main>
  );
}