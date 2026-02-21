import { z } from "zod";
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});
export const signupSchema = z
    .object({
    full_name: z
        .string()
        .min(1, "Full name is required")
        .max(100, "Name must be under 100 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    caretaker_email: z
        .string()
        .email("Please enter a valid caretaker email")
        .optional()
        .or(z.literal("")),
})
    .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
export const medicationSchema = z.object({
    name: z
        .string()
        .min(1, "Medication name is required")
        .max(100, "Name must be under 100 characters")
        .transform((val) => val.trim()),
    dosage: z
        .string()
        .min(1, "Dosage is required")
        .max(50, "Dosage must be under 50 characters")
        .transform((val) => val.trim()),
    frequency: z.enum(["daily", "twice_daily", "three_times_daily", "weekly"], {
        message: "Please select a valid frequency",
    }),
    reminder_time: z.string().optional(),
});
export const profileSchema = z.object({
    full_name: z
        .string()
        .min(1, "Full name is required")
        .max(100, "Name must be under 100 characters"),
    caretaker_email: z
        .string()
        .email("Please enter a valid caretaker email")
        .optional()
        .or(z.literal("")),
    notification_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
});
