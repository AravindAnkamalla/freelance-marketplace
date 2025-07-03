import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

import { UserRole } from "@/types/index";
export default async function Home() {
  const user = await currentUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (dbUser) {
      if (dbUser.role === UserRole.CLIENT) {
        redirect("/dashboard");
      } else if (dbUser.role === UserRole.FREELANCER) {
        redirect("/dashboard");
      }
    } else {
      redirect("/onboarding");
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-5xl font-bold text-blue-600 mb-8">
        Welcome to your Freelance Marketplace!
      </h1>
      <p className="text-lg text-gray-700">Sign up or log in to get started.</p>
      <div className="mt-8 flex space-x-4">
        <a
          href="/sign-in"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Sign In
        </a>
        <a
          href="/sign-up"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-600 transition-colors"
        >
          Sign Up
        </a>
      </div>
    </main>
  );
}
