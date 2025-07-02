
import { currentUser } from '@clerk/nextjs/server'; 
import { redirect } from 'next/navigation'; 
import prisma from '@/lib/db';
import { UserRole } from "@/types/index";


export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser(); 

  if (!user) {
   
    redirect('/sign-in');
  }

 
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });


  if (!dbUser || dbUser.role !== UserRole.CLIENT) {
    
    redirect('/');
  }

  const clientNav = (
    <nav className="bg-blue-500 text-white p-4 shadow-md">
      <ul className="flex space-x-8 container mx-auto">
        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
        <li><a href="/jobs/post" className="hover:underline">Post a Job</a></li>
        <li><a href="/dashboard/my-jobs" className="hover:underline">My Jobs</a></li>
        <li><a href="/profile" className="hover:underline">Profile</a></li> 
        <li><a href="/sign-out" className="hover:underline">Sign Out</a></li> 
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {clientNav} 
      <div className="container mx-auto p-4 py-8">
        {children} 
      </div>
    </div>
  );
}