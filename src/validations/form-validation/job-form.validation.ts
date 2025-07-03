import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string().min(1, { message: 'Job Title is required.' }),
  description: z.string().min(1, { message: 'Job Description is required.' }),
  budget: z.coerce.number({
    invalid_type_error: 'Budget must be a number.',
  }).positive({ message: 'Budget must be a positive number.' }),
  requiredSkills: z.string().min(1, { message: 'Required Skills are required.' }),
});