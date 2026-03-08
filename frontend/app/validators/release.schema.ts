import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string().optional(), // Used if editing existing track
  title: z.string().min(1, "Track title is required."),
  genre: z.string().min(1, "Genre is required."),
  isrc: z.string().optional(),
  trackNumber: z.number().min(1, "Track number must be at least 1."),
  featuring: z.string().optional(), // Simple string for now, will be ID lookup later
  audioFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Audio file is required."),
  duration: z.number().min(1, "Duration must be calculated."),
});

export const ReleaseSchema = z.object({
  // Step 1: Release Container Data
  title: z.string().min(1, "Release title is required."),
  releaseType: z.string().min(1, "Release type is required."),
  releaseDate: z.string().min(1, "Release date is required."),
  coverFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Cover art is required."),

  // Step 2: Tracks Array (Empty for Step 1, populated in Step 2)
  tracks: z
    .array(TrackSchema)
    .min(1, "A release must have at least one track."),
});

export type ReleaseFormData = z.infer<typeof ReleaseSchema>;
export type TrackFormData = z.infer<typeof TrackSchema>;
