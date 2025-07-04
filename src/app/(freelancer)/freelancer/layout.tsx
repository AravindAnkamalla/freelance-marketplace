
import { currentUser } from '@clerk/nextjs/server'; 
import { redirect } from 'next/navigation'; 
import prisma from '@/lib/db';
import { UserRole } from "@/types/index";
import FreelancerNavigationBar from '@/components/freelancer/FreelancerNavigationBar';



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


  if (!dbUser || dbUser.role !== UserRole.FREELANCER) {
    
    redirect('/');
  }

  

  return (
    <div className="min-h-screen bg-gray-100">
      <FreelancerNavigationBar/> 
      <div className="container mx-auto p-4 py-8">
        {children} 
      </div>
    </div>
  );
}