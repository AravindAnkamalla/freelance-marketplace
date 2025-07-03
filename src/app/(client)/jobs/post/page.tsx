// src/app/(client)/jobs/post/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '@/lib/actions';
import { CreateJobData } from '@/types';


export default function PostJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');

  
  const jobMutation = useMutation({
    mutationFn: async (jobData: CreateJobData) => {
      const result = await createJob(jobData); 
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['clientJobs'] });        
      queryClient.invalidateQueries({ queryKey: ['browseJobs'] });        

      alert('Job posted successfully!'); 
      setTitle('');
      setDescription('');
      setBudget('');
      setRequiredSkills('');
      router.push('/dashboard/jobs');
    },
   
    onError: (error: any) => {
      console.error('Job posting error:', error);
      alert(`Error posting job: ${error.message || 'An unexpected error occurred.'}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedBudget = parseFloat(budget);

    if (!title || !description || isNaN(parsedBudget) || parsedBudget <= 0 || skillsArray.length === 0) {
      alert('Please fill in all required fields correctly (Budget must be a positive number, skills comma-separated).');
      return; 
    }
    jobMutation.mutate({
      title,
      description,
      budget: parsedBudget,
      requiredSkills: skillsArray,
    });
  };

  return (
    <main className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Post a New Job</h1>
      <p className="text-lg text-gray-700 mb-8">Tell us about your project and find the perfect freelancer.</p>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        
        {jobMutation.isError && <p className="text-red-500 mb-4">{jobMutation.error?.message}</p>}
       
        {jobMutation.isSuccess && <p className="text-green-500 mb-4">Job posted successfully!</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
         
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build a React Dashboard"
              required
            />
          </div>

          
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
            <textarea
              id="description"
              rows={6}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project in detail..."
              required
            ></textarea>
          </div>

          
          <div>
            <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">Budget ($)</label>
            <input
              type="number"
              id="budget"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., 500.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

         
          <div>
            <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">Required Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g., React, Node.js, TypeScript"
              required
            />
          </div>

         
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full
              ${jobMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={jobMutation.isPending} 
          >
            {jobMutation.isPending ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </main>
  );
}