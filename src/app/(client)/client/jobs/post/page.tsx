'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CreateJobData } from '@/types';
import { createJob } from '@/lib/actions';
import { createJobFormSchema } from '@/validations/form-validation/job-form.validation';



type FormValues = z.infer<typeof createJobFormSchema>;

export default function PostJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(createJobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: 0, 
      requiredSkills: '',
    },
  });

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
      form.reset();
      setFormMessage({ type: 'success', text: 'Job posted successfully!' });
      setTimeout(() => {
        router.push('/client/dashboard/my-jobs');
      }, 1000);
    },
    onError: (error: any) => {
      console.error('Job posting error:', error);
      setFormMessage({ type: 'error', text: `Error posting job: ${error.message || 'An unexpected error occurred.'}` });
    },
  });

  const onSubmit = async (values: FormValues) => {
    setFormMessage(null);
    const skillsArray = values.requiredSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (skillsArray.length === 0) {
      form.setError('requiredSkills', {
        type: 'manual',
        message: 'Please enter at least one skill, separated by commas.',
      });
      return;
    }
    jobMutation.mutate({
      title: values.title,
      description: values.description,
      budget: values.budget,
      requiredSkills: skillsArray,
    });
  };

  return (
    <main className="container mx-auto p-4 py-4">
      <h1 className="text-4xl text-center font-bold text-gray-1000 mb-4">Post a New Job</h1>
      <p className="text-lg text-center  text-gray-700 mb-4">Tell us about your project and find the perfect freelancer.</p>

      <div className="bg-gray-100 p-8 rounded-b-xl shadow-md max-w-2xl mx-auto">
        {formMessage && (
          <div className={`mb-4 p-3 rounded-md text-center
            ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
          `}>
            {formMessage.text}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Build a React Dashboard" {...field} />
                  </FormControl>
                  <FormMessage /> 
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project in detail..." rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget ($)</FormLabel>
                  <FormControl>
                    
                    <Input
                      type="number"
                      placeholder="e.g., 500.00"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      min="100"
                      step="50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Required Skills Field */}
            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., React, Node.js, TypeScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={jobMutation.isPending} // Disable button while mutation is in progress
            >
              {jobMutation.isPending ? 'Posting Job...' : 'Post Job'}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
