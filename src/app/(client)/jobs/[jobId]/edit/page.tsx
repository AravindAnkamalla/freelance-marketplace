
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Job } from '@prisma/client';

interface EditJobPageProps {
  params: {
    jobId: string;
  };
}

const EditJobPage: React.FC<EditJobPageProps> = ({ params }) => {
  const jobId  = params.jobId;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'clientId' | 'assignedFreelancerId'>>({
    title: '',
    description: '',
    budget: 0,
    status: 'OPEN',
    requiredSkills: [],
    deadline: null,
  });
  const [skillsInput, setSkillsInput] = useState(''); 

  const { data: job, isLoading, isError, error } = useQuery<Job, Error>({
    queryKey: ['job', jobId], 
    queryFn: async (): Promise<Job> => {
      const response = await axios.get<Job>(`/api/jobs/my-jobs/${jobId}`); 
      return response.data;
    },
    enabled: !!jobId, 
  });

 
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        budget: job.budget,
        status: job.status,
        requiredSkills: job.requiredSkills || [],
        deadline: job.deadline ? new Date(job.deadline) : null,
      });
      setSkillsInput(job.requiredSkills?.join(', ') || '');
    }
  }, [job]);

  const updateJobMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      const response = await axios.patch(`/api/jobs/my-jobs/${jobId}`, {
        ...updatedData,
        budget: parseFloat(String(updatedData.budget)),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] }); 
      queryClient.invalidateQueries({ queryKey: ['clientJobs'] }); 
      alert('Job updated successfully!');
      router.push(`/jobs/${jobId}`);
    },
    onError: (err: any) => {
      console.error('Error updating job:', err);
      alert(`Failed to update job: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillsInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0),
    }));
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      deadline: value ? new Date(value) : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJobMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading job details for editing...</p></div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-red-600"><p>Error loading job: {error?.message || 'Unknown error'}</p></div>;
  }

  if (!job) {
    return <div className="flex justify-center items-center h-screen"><p>Job not found.</p></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Job: {job.title}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 border border-gray-200 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
          </select>
        </div>
        <div>
          <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
          <input
            type="text"
            id="requiredSkills"
            name="requiredSkills"
            value={skillsInput}
            onChange={handleSkillsChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., React, TypeScript, Tailwind CSS"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
            onChange={handleDeadlineChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={updateJobMutation.isPending}
          >
            {updateJobMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/client/jobs/${jobId}`)} // Go back to details page
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
        {updateJobMutation.isError && <p className="text-red-500 mt-2">Error: {updateJobMutation.error?.message || 'Failed to save job.'}</p>}
      </form>
    </div>
  );
};

export default EditJobPage;