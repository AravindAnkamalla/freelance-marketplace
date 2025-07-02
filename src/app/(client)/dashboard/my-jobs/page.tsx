
'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import axios from 'axios';
import Link from 'next/link';
interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  clientId: string;
}

const MyJobsPage: React.FC = () => {
  const queryClient = useQueryClient(); 

  const { data: jobs, isLoading, isError, error } = useQuery<Job[], Error>({
    queryKey: ['clientJobs'],
    queryFn: async (): Promise<Job[]> => {
      const response = await axios.get<Job[]>('/api/jobs/my-jobs');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });


  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await axios.delete(`/api/jobs/my-jobs/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientJobs'] });
      alert('Job deleted successfully!');
    },
    onError: (err: any) => {
      console.error('Error deleting job:', err);
      alert(`Failed to delete job: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJobMutation.mutate(jobId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your jobs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Error loading jobs: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Posted Jobs</h1>

      {deleteJobMutation.isPending && <p className="text-blue-500 mb-4">Deleting job...</p>}
      {deleteJobMutation.isError && <p className="text-red-500 mb-4">Error deleting job.</p>}

      {jobs && jobs.length === 0 ? (
        <p className="text-gray-600">You haven't posted any jobs yet. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>Budget: ${job.budget.toFixed(2)}</span>
                <span>Status: {job.status}</span>
              </div>
              <p className="text-xs text-gray-400">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
              <div className="mt-4 flex space-x-2">
                <Link href={`/jobs/${job.id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View Details
                </Link>
                <Link href={`/jobs/${job.id}/edit`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={deleteJobMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobsPage;