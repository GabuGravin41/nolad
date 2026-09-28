import type { CollectionId } from "../schema";

export interface Collection {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
}

export const collections: Collection[] = [
  {
    id: "medicine",
    name: "MedLab",
    tagline: "Radiology, pathology, dermatology, ophthalmology and physiological signals",
    description:
      "Competitions in which the input is a medical image or a bedside signal and the output informs a clinical decision: triage, detection, grading or localisation. Each report includes the clinical background a reader needs to understand why the labels look the way they do.",
  },
  {
    id: "molecular",
    name: "BioLab",
    tagline: "RNA, proteins, small molecules and cryo-electron tomography",
    description:
      "Competitions on the molecular side of biology: predicting structure from sequence, function from sequence and context, binding from chemistry, and particle locations in tomograms.",
  },
  {
    id: "beyond",
    name: "Beyond medicine",
    tagline: "Bioacoustics, sign language, mathematics and archaeology",
    description:
      "Competitions outside medicine that share techniques with the medical ones, or that were run under hard deployment constraints (CPU-only, on-device, fixed GPU time) worth studying on their own.",
  },
];

export const collectionById = new Map(collections.map((c) => [c.id, c]));
