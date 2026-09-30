/**
 * How reports are classified. Three independent facets, each a controlled
 * vocabulary, so the catalogue can grow to any Kaggle competition:
 *
 * - domain:   the field the problem comes from (one per report)
 * - dataTypes: what the model reads (one or more)
 * - taskTypes: what the model outputs (one or more)
 *
 * Techniques (data/techniques.ts) are a fourth facet: how the problem was solved.
 * Domains without reports are listed here so the vocabulary is fixed in
 * advance; the site shows only domains that have reports.
 */

export const domainIds = [
  "medical-imaging",
  "health-signals",
  "life-sciences",
  "ecology-environment",
  "earth-climate-energy",
  "physical-sciences",
  "education",
  "language",
  "mathematics-reasoning",
  "humanities",
  "finance-economics",
  "business-operations",
  "sport-games",
] as const;
export type DomainId = (typeof domainIds)[number];

export const dataTypeIds = [
  "images",
  "volumes",
  "video",
  "audio",
  "time-series",
  "keypoints",
  "text",
  "tabular",
  "biological-sequences",
  "molecules",
  "networks",
] as const;
export type DataTypeId = (typeof dataTypeIds)[number];

export const taskTypeIds = [
  "classification",
  "ordinal-grading",
  "segmentation",
  "detection",
  "regression",
  "transcription",
  "generation",
  "retrieval-matching",
  "forecasting",
] as const;
export type TaskTypeId = (typeof taskTypeIds)[number];

export interface Term<Id extends string> {
  id: Id;
  name: string;
  description: string;
}

export const domains: Term<DomainId>[] = [
  { id: "medical-imaging", name: "Medical imaging", description: "Radiology, pathology, dermatology and ophthalmology images, from X-ray and CT to whole-slide microscopy." },
  { id: "health-signals", name: "Health and physiological signals", description: "Recordings from the body over time: EEG, ECG, wearable sensors and sleep." },
  { id: "life-sciences", name: "Life sciences and chemistry", description: "Molecular and cell biology, structural biology, protein function and drug discovery." },
  { id: "ecology-environment", name: "Ecology and environment", description: "Species monitoring, bioacoustics, conservation and ecosystems." },
  { id: "earth-climate-energy", name: "Earth, climate and energy", description: "Weather, climate, remote sensing, geoscience and energy systems." },
  { id: "physical-sciences", name: "Physical sciences and engineering", description: "Physics, astronomy, materials and engineering measurements." },
  { id: "education", name: "Education and learning", description: "Learning materials, curricula, assessment and student writing." },
  { id: "language", name: "Language and communication", description: "Natural language, translation, speech and sign language." },
  { id: "mathematics-reasoning", name: "Mathematics and reasoning", description: "Mathematical problem solving and abstract reasoning." },
  { id: "humanities", name: "Humanities and cultural heritage", description: "Archaeology, historical documents and cultural collections." },
  { id: "finance-economics", name: "Finance and economics", description: "Markets, credit, fraud and economic forecasting." },
  { id: "business-operations", name: "Business and operations", description: "Retail demand, logistics, recommendation and customer behaviour." },
  { id: "sport-games", name: "Sport and games", description: "Sports analytics and game-playing agents." },
];

export const dataTypes: Term<DataTypeId>[] = [
  { id: "images", name: "Images", description: "2D images, including photographs, radiographs and whole-slide images." },
  { id: "volumes", name: "3D volumes", description: "CT, MRI, tomograms and other stacks of slices." },
  { id: "video", name: "Video", description: "Sequences of image frames." },
  { id: "audio", name: "Audio", description: "Sound recordings." },
  { id: "time-series", name: "Time series and signals", description: "Measurements sampled over time: sensors, EEG, prices." },
  { id: "keypoints", name: "Keypoints and landmarks", description: "Coordinates of body, hand or face landmarks over time." },
  { id: "text", name: "Text", description: "Natural-language or mathematical text." },
  { id: "tabular", name: "Tabular data", description: "Rows of measured or engineered features." },
  { id: "biological-sequences", name: "Biological sequences", description: "DNA, RNA and protein sequences." },
  { id: "molecules", name: "Molecules", description: "Small molecules as strings (SMILES) or graphs." },
  { id: "networks", name: "Networks and graphs", description: "Interaction networks, ontologies and other graphs." },
];

export const taskTypes: Term<TaskTypeId>[] = [
  { id: "classification", name: "Classification", description: "Assigning one or more labels, or a probability distribution over labels." },
  { id: "ordinal-grading", name: "Ordinal grading", description: "Predicting a grade on an ordered scale." },
  { id: "segmentation", name: "Segmentation", description: "Labelling every pixel or voxel." },
  { id: "detection", name: "Detection and localisation", description: "Finding where objects or events are." },
  { id: "regression", name: "Regression", description: "Predicting continuous values." },
  { id: "transcription", name: "Transcription", description: "Converting a sequence into a sequence of symbols, such as sign language into letters." },
  { id: "generation", name: "Generation and reasoning", description: "Producing free-form output, such as a solution to a problem." },
  { id: "retrieval-matching", name: "Retrieval and matching", description: "Ranking or matching items against a query, such as content to curriculum topics." },
  { id: "forecasting", name: "Forecasting", description: "Predicting future values of a time series." },
];

export const domainById = new Map(domains.map((d) => [d.id, d]));
export const dataTypeById = new Map(dataTypes.map((d) => [d.id, d]));
export const taskTypeById = new Map(taskTypes.map((d) => [d.id, d]));
