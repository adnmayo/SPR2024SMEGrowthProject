import * as z from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .refine(
      (str) => str.trim().indexOf(" ") === -1,
      "Please enter a valid name"
    ),
  lastName: z
    .string()
    .refine(
      (str) => str.trim().indexOf(" ") === -1,
      "Please enter a valid name"
    ),

  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),

  picture: z.custom<File>((v) => v instanceof File, {
    message: "Picture is required",
  }),
  jobTitle: z.string(),
  organisation: z.string(),
  mobileNumber: z.string().length(10, "Please enter a valid mobile number"),
});

export type SignupData = z.infer<typeof signupSchema>;
