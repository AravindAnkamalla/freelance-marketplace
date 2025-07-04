"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import JobCard from "@/components/JobCard";
import { Job } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";

const MyJobsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<String>("");
  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = useQuery<Job[], Error>({
    queryKey: ["clientJobs"],
    queryFn: async (): Promise<Job[]> => {
      const response = await axios.get<Job[]>("/api/jobs/my-jobs");
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
      queryClient.invalidateQueries({ queryKey: ["clientJobs"] });
      setErr(false);
      setAlertMessage("Job Deleted Succefully");
    },
    onError: (err: any) => {
      console.error("Error deleting job:", err);
      setErr(true);
      setAlertMessage(err.response?.data?.message || err.message);
    },
  });

  const handleDelete = (jobId: string) => {
    deleteJobMutation.mutate(jobId);
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
        <p>Error loading jobs: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Posted Jobs</h1>

      {deleteJobMutation.isPending && (
        <p className="text-blue-500 mb-4">Deleting job...</p>
      )}
      {deleteJobMutation.isError && (
        <p className="text-red-500 mb-4">Error deleting job.</p>
      )}

      {jobs && jobs.length === 0 ? (
        <p className="text-gray-600">
          You haven't posted any jobs yet. Start by creating one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
              isDeleting={deleteJobMutation.isPending}
            />
          ))}
        </div>
      )}
      {alertMessage && (
        <Alert variant={err ? "destructive" : "default"}>
          {err ? (
            <XCircleIcon className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
          )}
          <AlertTitle>{err ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MyJobsPage;
