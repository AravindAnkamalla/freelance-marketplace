
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query'; 
import axios from 'axios';
export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const onboardMutation = useMutation({
    mutationFn: async (role: 'CLIENT' | 'FREELANCER') => {
      const response = await axios.post('/api/onboard-user', {
        clerkId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName || user?.username,
        profilePicture: user?.imageUrl,
        role: role,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (variables === 'CLIENT') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Onboarding error:', error.response?.data || error.message);
      alert(`Error onboarding: ${error.response?.data?.message || error.message}`);
    },
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const handleRoleSelection = (role: 'CLIENT' | 'FREELANCER') => {
    setSelectedRole(role);
    onboardMutation.mutate(role); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome! Tell us about yourself.</h1>
        <p className="text-gray-600 mb-8">Are you looking to hire talent or find work?</p>

        {onboardMutation.isError && (
          <p className="text-red-500 mb-4">{onboardMutation.error?.message || 'An error occurred.'}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-200
              ${selectedRole === 'CLIENT' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
              ${onboardMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleRoleSelection('CLIENT')}
            disabled={onboardMutation.isPending}
          >
            <span className="text-5xl mb-3" role="img" aria-label="briefcase">💼</span>
            <span className="text-xl font-semibold text-gray-800">I am a Client</span>
            <p className="text-sm text-gray-500 mt-1">Hire freelancers for your projects.</p>
          </button>

          <button
            className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-200
              ${selectedRole === 'FREELANCER' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}
              ${onboardMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleRoleSelection('FREELANCER')}
            disabled={onboardMutation.isPending}
          >
            <span className="text-5xl mb-3" role="img" aria-label="laptop">💻</span>
            <span className="text-xl font-semibold text-gray-800">I am a Freelancer</span>
            <p className="text-sm text-gray-500 mt-1">Find and work on projects.</p>
          </button>
        </div>
        {onboardMutation.isPending && (
          <p className="text-gray-500 mt-4">Onboarding...</p>
        )}
      </div>
    </div>
  );
}