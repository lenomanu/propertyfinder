import { z } from "zod";


export const applicationSchema = z.object({
  agencyName: z
    .string()
    .trim()
    .min(2, "Agency name must be at least 2 characters.")
    .max(100, "Agency name must be less than 100 characters."),

  town: z
    .string()
    .trim()
    .min(2, "Town is required.")
    .max(100, "Town must be less than 100 characters."),

  location: z
    .string()
    .trim()
    .min(2, "Location is required.")
    .max(200, "Location must be less than 200 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),

  instagram: z
    .string()
    .trim()
    .url("Please enter a valid Instagram URL.")
    .or(z.literal("")),

  tiktok: z
    .string()
    .trim()
    .url("Please enter a valid TikTok URL.")
    .or(z.literal("")),

  facebook: z
    .string()
    .trim()
    .url("Please enter a valid Facebook URL.")
    .or(z.literal("")),
});

