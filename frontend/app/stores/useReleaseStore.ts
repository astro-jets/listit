import { create } from "zustand";
import type {
  ReleaseFormData,
  TrackFormData,
} from "~/validators/release.schema";

interface ReleaseStore {
  // Global release state (Step 1 data + Tracks array)
  release: Partial<ReleaseFormData>;

  // Multi-step form control
  currentStep: number;

  // Actions
  setReleaseMetadata: (data: Partial<ReleaseFormData>) => void;
  addTrack: (track: TrackFormData) => void;
  removeTrack: (trackIndex: number) => void;
  updateTrack: (trackIndex: number, track: Partial<TrackFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStore: () => void;
}

const initialReleaseState: Partial<ReleaseFormData> = {
  releaseType: "single",
  tracks: [],
  // Initialize other fields to null/empty string as needed
};

export const useReleaseStore = create<ReleaseStore>((set) => ({
  release: initialReleaseState,
  currentStep: 1, // Start at step 1

  setReleaseMetadata: (data) =>
    set((state) => ({
      release: { ...state.release, ...data },
    })),

  addTrack: (track) =>
    set((state) => ({
      release: {
        ...state.release,
        tracks: [...(state.release.tracks || []), track],
      },
    })),

  removeTrack: (trackIndex) =>
    set((state) => ({
      release: {
        ...state.release,
        tracks: state.release.tracks?.filter((_, i) => i !== trackIndex),
      },
    })),

  updateTrack: (trackIndex, update) =>
    set((state) => ({
      release: {
        ...state.release,
        tracks: state.release.tracks?.map((track, i) =>
          i === trackIndex ? { ...track, ...update } : track
        ),
      },
    })),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  resetStore: () => set({ release: initialReleaseState, currentStep: 1 }),
}));
