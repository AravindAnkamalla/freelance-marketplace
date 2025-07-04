"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { onboardingSchema } from "@/validations/form-validation/job-form.validation";
import { BriefcaseIcon, CodeIcon } from "lucide-react";

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: undefined,
      skills: "",
      bio: "",
    },
  });

  const role = watch("role");

  const onSubmit = async (values: OnboardingFormValues) => {
    if (!user) return;

    const payload: any = {
      role: values.role,
      email: user.emailAddresses?.[0]?.emailAddress,
    };

    if (values.role === "FREELANCER") {
      payload.skills = values.skills
        ?.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      payload.bio = values.bio;
    }

    try {
      await axios.post("/api/onboard-user", payload);

      router.push(
        values.role === "CLIENT" ? "/client/dashboard" : "/freelancer/dashboard/browse-jobs"
      );
    } catch (error: any) {
      console.error("Onboarding failed:", error);
      alert("Failed to onboard. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Welcome! Select Your Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              {/* <Label>I am a:</Label> */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={role === "CLIENT" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setValue("role", "CLIENT")}
                >
                  <BriefcaseIcon className="w-4 h-4" />
                  Client
                </Button>
                <Button
                  type="button"
                  variant={role === "FREELANCER" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setValue("role", "FREELANCER")}
                >
                  {" "}
                  <CodeIcon className="w-4 h-4" />
                  Freelancer
                </Button>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {role === "FREELANCER" && (
              <div className="space-y-4 border-t pt-6">
                <h2 className="text-lg font-semibold">Freelancer Profile</h2>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    {...register("skills")}
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">
                      {errors.skills.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
