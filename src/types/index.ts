import { Job, Proposal } from "@prisma/client";
export enum UserRole {
  CLIENT = "CLIENT",
  FREELANCER = "FREELANCER",
}

export enum JobStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  AWARDED = "AWARDED",
}

export interface CreateJobData {
  title: string;
  description: string;
  budget: number;
  requiredSkills: string[];
  deadline?: Date;
}

export type ProposalWithJob = Proposal & {
  job: Job;
};

export type GetJobsResponse = {
  assignedJobs: Job[];
  proposals: ProposalWithJob[];
};
export type GetRecommendedJobsResponse = {
  jobs: Job[];
};
