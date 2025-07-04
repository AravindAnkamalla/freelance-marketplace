"use client";

import axios from "axios";
import { useUser } from "@clerk/nextjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";

import { GetRecommendedJobsResponse } from "@/types";

export default function RecommendedJobsPage() {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["freelancer-dashboard"],
    queryFn: async () => {
      const res = await axios.get<GetRecommendedJobsResponse>(
        "/api/freelancer/recommended-jobs"
      );
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading recommended jobs...</p>;
  if (error) return <div>Error loading dashboard</div>;
  const jobs = data?.jobs ?? [];
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">Recommended Jobs</h1>

      {jobs?.length === 0 ? (
        <p className="text-center text-gray-500">
          No jobs found that match your skills.
        </p>
      ) : (
        jobs?.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {job.title}
                <span className="text-sm font-medium text-muted-foreground">
                  ${job.budget}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              {job.deadline && (
                <p className="text-sm text-gray-500">
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}

              <Button variant="secondary">View Job</Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
