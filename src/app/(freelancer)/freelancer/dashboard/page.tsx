"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Skeleton } from "@/components/ui/skeleton";
import { AssignedJobCard } from "@/components/freelancer/AssignedJobCard";
import { ProposalCard } from "@/components/freelancer/ProposalCard";

export default function FreelancerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["freelancer-dashboard"],
    queryFn: async () => {
      const res = await axios.get("/api/freelancer/dashboard");
      return res.data;
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (error) return <div>Error loading dashboard</div>;

  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Assigned Jobs</h2>
        <div className="grid gap-4">
          {data.assignedJobs.map((job: any) => (
            <AssignedJobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">My Proposals</h2>
        <div className="grid gap-4">
          {data.proposals.map((p: any) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
