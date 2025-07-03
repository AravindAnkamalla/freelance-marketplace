
'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const OnboardingPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [freelancerSkills, setFreelancerSkills] = useState<string>(''); // Comma-separated skills
  const [freelancerBio, setFreelancerBio] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRole) {
      setError('Please select a role.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        role: selectedRole,
        email: user.emailAddresses?.[0]?.emailAddress, 
      };

      if (selectedRole === 'FREELANCER') {
        payload.skills = freelancerSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        payload.bio = freelancerBio;

      }

      await axios.post('/api/onboard-user', payload);

      if (selectedRole === 'CLIENT') {
        router.push('/dashboard'); 
      } else if (selectedRole === 'FREELANCER') {
        router.push('/freelancer/browse-jobs'); 
      }

    } catch (err: any) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Failed to onboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome! Select Your Role</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex justify-around space-x-4">
              <button
                type="button"
                onClick={() => setSelectedRole('CLIENT')}
                className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200 ${
                  selectedRole === 'CLIENT' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('FREELANCER')}
                className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200 ${
                  selectedRole === 'FREELANCER' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Freelancer
              </button>
            </div>
          </div>

          {selectedRole === 'FREELANCER' && (
            <div className="space-y-4 pt-4 border-t border-gray-200 mt-6">
              <h2 className="text-xl font-bold">Freelancer Profile</h2>
              <div>
                <label htmlFor="freelancerBio" className="block text-sm font-medium text-gray-700">Tell us about yourself (Bio)</label>
                <textarea
                  id="freelancerBio"
                  value={freelancerBio}
                  onChange={(e) => setFreelancerBio(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., A passionate React developer with 5 years of experience..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="freelancerSkills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  id="freelancerSkills"
                  value={freelancerSkills}
                  onChange={(e) => setFreelancerSkills(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., React, TypeScript, Tailwind CSS, Node.js"
                />
              </div>
              {/* Add more freelancer fields here (e.g., hourly rate, portfolio links) */}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!selectedRole || loading}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;