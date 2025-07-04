import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string().min(1, { message: 'Job Title is required.' }),
  description: z.string().min(1, { message: 'Job Description is required.' }),
  budget: z.coerce.number({
    invalid_type_error: 'Budget must be a number.',
  }).positive({ message: 'Budget must be a positive number.' }),
  requiredSkills: z.string().min(1, { message: 'Required Skills are required.' }),
});

export const editJobFormSchema = z.object({
  title: z.string().min(1, { message: 'Job Title is required.' }),
  description: z.string().min(1, { message: 'Job Description is required.' }),
  budget: z.coerce.number({
    invalid_type_error: 'Budget must be a number.',
  }).positive({ message: 'Budget must be a positive number.' }),
  status: z.enum(['OPEN', 'COMPLETED','CANCELLED','AWARDED', 'IN_PROGRESS'], {
    required_error: 'Job status is required.',
  }),
  requiredSkills: z.string().min(1, { message: 'Required Skills are required.' }),
  deadline: z.date().nullable().optional(), 
});

export const onboardingSchema = z.object({
  role: z.enum(['CLIENT', 'FREELANCER']),
  skills: z.string().optional(),
  bio: z.string().optional(),
});