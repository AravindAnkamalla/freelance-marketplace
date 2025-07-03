"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { editJobFormSchema } from "@/validations/form-validation/job-form.validation";
import { Job } from "@prisma/client";

interface EditJobPageProps {
  params: {
    jobId: string;
  };
}
type FormValues = z.infer<typeof editJobFormSchema>;

const EditJobPage: React.FC<EditJobPageProps> = ({ params }) => {
  const jobId = params.jobId;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(editJobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      status: "OPEN",
      requiredSkills: "",
      deadline: null,
    },
  });

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery<Job, Error>({
    queryKey: ["job", jobId],
    queryFn: async (): Promise<Job> => {
      const response = await axios.get<Job>(`/api/jobs/my-jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });
  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        description: job.description,
        budget: job.budget,
        status: job.status,
        requiredSkills: job.requiredSkills?.join(", ") || "",
        deadline: job.deadline ? new Date(job.deadline) : null,
      });
    }
  }, [job, form]);

  const updateJobMutation = useMutation({
    mutationFn: async (
      updatedData: Omit<FormValues, "requiredSkills"> & {
        requiredSkills: string[];
      }
    ) => {
      const response = await axios.patch(
        `/api/jobs/my-jobs/${jobId}`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["clientJobs"] });
      setFormMessage({ type: "success", text: "Job updated successfully!" });
      
      setTimeout(() => {
        router.push(`/jobs/${jobId}`);
      }, 1000);
    },
    onError: (err: any) => {
      console.error("Error updating job:", err);
      setFormMessage({
        type: "error",
        text: `Failed to update job: ${
          err.message || "An unexpected error occurred."
        }`,
      });
    },
  });
  const onSubmit = async (values: FormValues) => {
    setFormMessage(null);

    const skillsArray = values.requiredSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      form.setError("requiredSkills", {
        type: "manual",
        message: "Please enter at least one skill, separated by commas.",
      });
      return;
    }

    updateJobMutation.mutate({
      ...values,
      requiredSkills: skillsArray,
      deadline: values.deadline instanceof Date ? values.deadline : null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading job details for editing...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Error loading job: {error?.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Job: {job.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 space-y-4">
        {formMessage && (
          <div
            className={`mb-4 p-3 rounded-md text-center
            ${
              formMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
          >
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
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget Field */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">OPEN</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="AWARDED">AWARDED</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., React, TypeScript, Tailwind CSS"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit" disabled={updateJobMutation.isPending}>
                {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/jobs/${jobId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditJobPage;
