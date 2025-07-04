
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ClientDashboardPage() {
  const clerkUser = await currentUser(); 
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id },
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Client Dashboard
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome back, {dbUser?.name || clerkUser?.emailAddresses[0]?.emailAddress}!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Post a New Job</h2>
          <p className="text-gray-600 mb-4">Have a project? Find the right freelancer for it.</p>
          <Link href='/client/jobs/post' >
          <Button variant={'outline'} className='hover:bg-gray-300'>Post Job</Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">My Posted Jobs</h2>
          <p className="text-gray-600 mb-4">View and manage your active and completed jobs.</p>
          <Link href='/client/dashboard/my-jobs' >
          <Button variant={'outline'} className='hover:bg-gray-300'>View Jobs</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}