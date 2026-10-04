/**
 * How the first 25 competitions were chosen and ordered.
 *
 * Each candidate is scored 1–5 on five criteria. The weighted total decides
 * the order in which reports were written. The scores are editorial
 * judgements made from the winners' write-ups, not measurements; the
 * reasons are recorded so they can be challenged.
 */

export interface Criterion {
  id: "deployability" | "documentation" | "impact" | "techniques" | "accessibility";
  name: string;
  weight: number;
  question: string;
}

export const criteria: Criterion[] = [
  { id: "deployability", name: "Deployability", weight: 0.3, question: "Could the winning approach run outside Kaggle under realistic hardware, time and licence constraints?" },
  { id: "documentation", name: "Documentation", weight: 0.2, question: "Are there detailed write-ups, released code, weights or a peer-reviewed paper?" },
  { id: "impact", name: "Impact", weight: 0.2, question: "How much does solving the problem matter to people, clinicians or science?" },
  { id: "techniques", name: "Transferable techniques", weight: 0.15, question: "Does the solution teach methods that carry over to other problems?" },
  { id: "accessibility", name: "Compute accessibility", weight: 0.15, question: "Was it trained on hardware a student or small lab can obtain (Kaggle, Colab, one consumer GPU)?" },
];

export interface RankedCompetition {
  slug: string;
  name: string;
  scores: Record<Criterion["id"], number>;
  reason: string;
}

export const ranked: RankedCompetition[] = [
  { slug: "rsna-intracranial-aneurysm-detection", name: "RSNA Intracranial Aneurysm Detection (2025)", scores: { deployability: 5, documentation: 5, impact: 5, techniques: 5, accessibility: 3 }, reason: "About 18 seconds per scan on a T4, code and weights required by the rules, a 3D Slicer plug-in from the runner-up, and a clear ablation study." },
  { slug: "siim-acr-pneumothorax-segmentation", name: "SIIM-ACR Pneumothorax Segmentation (2019)", scores: { deployability: 5, documentation: 5, impact: 4, techniques: 4, accessibility: 5 }, reason: "Small U-Nets trained on one or two consumer GPUs; the classify-then-segment pattern later reused in other segmentation competitions." },
  { slug: "rsna-intracranial-hemorrhage-detection", name: "RSNA Intracranial Hemorrhage Detection (2019)", scores: { deployability: 4, documentation: 5, impact: 5, techniques: 4, accessibility: 3 }, reason: "Winning method later published in NeuroImage: Clinical; introduced the slice-embedding sequence model reused across later CT competitions." },
  { slug: "asl-fingerspelling", name: "Google ASL Fingerspelling Recognition (2023)", scores: { deployability: 5, documentation: 5, impact: 4, techniques: 5, accessibility: 3 }, reason: "The submission itself had to be a TFLite model under 40 MB; the winner's model is phone-ready by construction." },
  { slug: "birdclef-2024", name: "BirdCLEF 2024", scores: { deployability: 5, documentation: 5, impact: 3, techniques: 4, accessibility: 5 }, reason: "CPU-only inference in 120 minutes; winners trained only on Kaggle P100 kernels and used OpenVINO." },
  { slug: "rsna-2024-lumbar-spine-degenerative-classification", name: "RSNA Lumbar Spine Degenerative Classification (2024)", scores: { deployability: 4, documentation: 5, impact: 5, techniques: 4, accessibility: 5 }, reason: "Winner trained everything on Google Colab with a T4; a clean coordinate-then-crop pipeline." },
  { slug: "czii-cryo-et-object-identification", name: "CZII CryoET Object Identification (2025)", scores: { deployability: 5, documentation: 5, impact: 4, techniques: 5, accessibility: 3 }, reason: "TensorRT-exported 3D models, full code and weights; point detection explained in detail." },
  { slug: "biohub-cell-tracking-during-development", name: "Biohub Cell Tracking During Development (2026)", scores: { deployability: 4, documentation: 5, impact: 5, techniques: 5, accessibility: 4 }, reason: "Fast 3D U-Net and LightGlue transformer linking on 4D light-sheet microscopy; solves lineage reconstruction under sparse annotations without heavy ILP solvers." },
  { slug: "prostate-cancer-grade-assessment", name: "PANDA Prostate Cancer Grade Assessment (2020)", scores: { deployability: 4, documentation: 4, impact: 5, techniques: 4, accessibility: 4 }, reason: "Top algorithms were externally validated in Nature Medicine; the competition is a case study in label noise." },
  { slug: "UBC-OCEAN", name: "UBC Ovarian Cancer Subtype Classification (2023–24)", scores: { deployability: 4, documentation: 5, impact: 4, techniques: 5, accessibility: 4 }, reason: "A foundation-model-plus-MIL pipeline that fits a single P100; weights carry a non-commercial licence." },
  { slug: "isic-2024-challenge", name: "ISIC 2024 Skin Cancer Detection with 3D-TBP", scores: { deployability: 4, documentation: 5, impact: 5, techniques: 4, accessibility: 5 }, reason: "Phone-quality images and a triage framing; gradient-boosted trees plus small image models, trained in minutes." },
  { slug: "rsna-2022-cervical-spine-fracture-detection", name: "RSNA Cervical Spine Fracture Detection (2022)", scores: { deployability: 4, documentation: 4, impact: 5, techniques: 4, accessibility: 3 }, reason: "Segment-then-classify with 2.5D sequence models; fits in 7.5 hours for the whole test set." },
  { slug: "rsna-breast-cancer-detection", name: "RSNA Screening Mammography Breast Cancer Detection (2023)", scores: { deployability: 4, documentation: 5, impact: 5, techniques: 4, accessibility: 3 }, reason: "Four ConvNeXt-small models at high resolution; unusually honest write-up about thresholds and luck." },
  { slug: "rsna-str-pulmonary-embolism-detection", name: "RSNA STR Pulmonary Embolism Detection (2020)", scores: { deployability: 4, documentation: 5, impact: 4, techniques: 4, accessibility: 3 }, reason: "Two-stage image and study models with label-consistency post-processing that mirrors clinical reporting rules." },
  { slug: "child-mind-institute-detect-sleep-states", name: "Child Mind Institute Detect Sleep States (2023)", scores: { deployability: 4, documentation: 5, impact: 4, techniques: 4, accessibility: 5 }, reason: "Small GRU U-Nets on wrist accelerometry; the post-processing that optimises event AP is fully explained." },
  { slug: "aptos2019-blindness-detection", name: "APTOS 2019 Blindness Detection", scores: { deployability: 4, documentation: 4, impact: 5, techniques: 3, accessibility: 4 }, reason: "Screening for diabetic retinopathy in rural India; simple regression-to-grade models with pseudo-labels." },
  { slug: "rsna-2023-abdominal-trauma-detection", name: "RSNA Abdominal Trauma Detection (2023)", scores: { deployability: 3, documentation: 5, impact: 5, techniques: 4, accessibility: 3 }, reason: "Organ-aware 2.5D models with auxiliary segmentation losses; the runner-up's strongest single model beat its own ensemble." },
  { slug: "hms-harmful-brain-activity-classification", name: "HMS Harmful Brain Activity Classification (2024)", scores: { deployability: 3, documentation: 4, impact: 4, techniques: 5, accessibility: 4 }, reason: "Predicting expert vote distributions on EEG; a single-model gold solution exists alongside the winning ensemble." },
  { slug: "stanford-ribonanza-rna-folding", name: "Stanford Ribonanza RNA Folding (2023)", scores: { deployability: 4, documentation: 5, impact: 4, techniques: 5, accessibility: 3 }, reason: "Small transformers with base-pair-probability attention bias; length generalisation studied carefully." },
  { slug: "leash-BELKA", name: "Leash BELKA: Predict New Medicines (2024)", scores: { deployability: 4, documentation: 3, impact: 4, techniques: 4, accessibility: 4 }, reason: "A 4-layer SMILES transformer, pretrained in two stages on Colab, generalised best to unseen chemistry." },
  { slug: "uw-madison-gi-tract-image-segmentation", name: "UW-Madison GI Tract Image Segmentation (2022)", scores: { deployability: 3, documentation: 4, impact: 4, techniques: 4, accessibility: 4 }, reason: "Radiotherapy contouring on MR-Linac; 2.5D and 3D models combined, weights not released." },
  { slug: "hubmap-organ-segmentation", name: "HuBMAP + HPA: Hacking the Human Body (2022)", scores: { deployability: 3, documentation: 4, impact: 3, techniques: 4, accessibility: 5 }, reason: "Segmentation under lab-to-lab domain shift; trained on Colab; pretrained SegFormer weights are non-commercial." },
  { slug: "siim-isic-melanoma-classification", name: "SIIM-ISIC Melanoma Classification (2020)", scores: { deployability: 3, documentation: 5, impact: 4, techniques: 3, accessibility: 3 }, reason: "Validation on several years of ISIC data survived a severe shake-up; diagnosis targets beat binary targets." },
  { slug: "ai-mathematical-olympiad-progress-prize-2", name: "AI Mathematical Olympiad Progress Prize 2 (2024–25)", scores: { deployability: 3, documentation: 5, impact: 4, techniques: 5, accessibility: 1 }, reason: "Inference fits four L4 GPUs in five hours; training used 512 H100s for two days, which shows where the compute went." },
  { slug: "cafa-5-protein-function-prediction", name: "CAFA 5 Protein Function Prediction (2023)", scores: { deployability: 3, documentation: 4, impact: 4, techniques: 4, accessibility: 2 }, reason: "Prospective evaluation on annotations published after the deadline; ontology-aware methods." },
  { slug: "vesuvius-challenge-ink-detection", name: "Vesuvius Challenge Ink Detection (2023)", scores: { deployability: 3, documentation: 4, impact: 3, techniques: 4, accessibility: 3 }, reason: "Depth-invariant 3D-to-2D segmentation on micro-CT; the same problem shape as weakly labelled medical CT." },
];

export interface RejectedCompetition {
  slug: string;
  name: string;
  reason: string;
}

export const rejected: RejectedCompetition[] = [
  {
    slug: "vinbigdata-chest-xray-abnormalities-detection",
    name: "VinBigData Chest X-ray Abnormalities Detection (2021)",
    reason:
      "The winning margin came from weighted-box fusion over dozens of detectors, with the heaviest weight on a stage validated only against the public leaderboard. The team reports that a less leaderboard-tuned blend would have scored higher on the private set. The competition is still instructive about label protocols (three independent readers in training, a five-reader consensus in test) and may return as a lessons page.",
  },
];

export function weightedScore(scores: RankedCompetition["scores"]): number {
  return criteria.reduce((sum, c) => sum + c.weight * scores[c.id], 0);
}
