/**
 * Technique taxonomy. Reports reference these ids in their `techniques`
 * frontmatter; the technique pages are built from the reverse index.
 */

export type TechniqueGroup =
  | "task"
  | "representation"
  | "architecture"
  | "training"
  | "inference"
  | "validation";

export interface Technique {
  id: string;
  name: string;
  group: TechniqueGroup;
  description: string;
}

export const techniqueGroups: { id: TechniqueGroup; name: string; description: string }[] = [
  { id: "task", name: "Task formulations", description: "How the problem is posed to the model: what goes in, what comes out, and what counts as correct." },
  { id: "representation", name: "Input representations", description: "How raw measurements (scans, audio, sequences, landmarks) are turned into arrays a network can consume." },
  { id: "architecture", name: "Architectures", description: "The model families that carried the winning solutions." },
  { id: "training", name: "Training methods", description: "Losses, sampling schemes, label handling and pretraining strategies." },
  { id: "inference", name: "Inference and deployment", description: "What happens after training: ensembling, test-time augmentation, thresholds, compression and acceleration." },
  { id: "validation", name: "Validation", description: "How competitors estimated generalisation without overfitting a small public leaderboard." },
];

export const techniques: Technique[] = [
  // Task formulations
  { id: "image-classification", name: "Image classification", group: "task", description: "Map an image (or a stack of images) to one or more class probabilities." },
  { id: "multi-label-classification", name: "Multi-label classification", group: "task", description: "Several labels can be true at once; each gets its own sigmoid output and binary loss." },
  { id: "ordinal-grading", name: "Ordinal grading", group: "task", description: "Classes carry an order (grade 0 to 4, mild to severe); errors far from the truth should cost more than near misses." },
  { id: "semantic-segmentation", name: "Semantic segmentation", group: "task", description: "Assign a class to every pixel or voxel." },
  { id: "object-detection", name: "Object detection", group: "task", description: "Predict boxes (or regions) and a class for each object in an image." },
  { id: "point-detection", name: "Point and centre detection", group: "task", description: "Locate objects by their centre coordinates rather than by boxes or masks; common when objects of one class share a size." },
  { id: "localisation-then-classification", name: "Localise, then classify", group: "task", description: "A first model finds where to look (organ, vertebra, lung, vessel); a second model classifies only that region." },
  { id: "event-detection", name: "Event detection in time series", group: "task", description: "Predict the times at which discrete events happen in a long signal, scored by matching within tolerances." },
  { id: "sequence-to-sequence", name: "Sequence-to-sequence", group: "task", description: "Map an input sequence (frames, tokens) to an output sequence of different length, such as characters." },
  { id: "per-position-regression", name: "Per-position regression", group: "task", description: "Predict a continuous value for every element of a sequence (for example, every nucleotide)." },
  { id: "multiple-instance-learning", name: "Multiple instance learning", group: "task", description: "The label belongs to a bag (a slide, a scan, a patient) while the model sees instances (tiles, slices); pooling decides which instances carry the label." },
  { id: "hierarchical-labels", name: "Hierarchical label spaces", group: "task", description: "Labels live in a graph (for example, Gene Ontology); predicting a term implies predicting its ancestors." },
  { id: "tabular-learning", name: "Tabular learning", group: "task", description: "Rows of engineered features, usually modelled with gradient-boosted trees." },
  { id: "mathematical-reasoning", name: "Mathematical reasoning with LLMs", group: "task", description: "Generate a chain of reasoning, optionally executing code, and return a final answer." },

  // Representations
  { id: "ct-windowing", name: "CT windowing", group: "representation", description: "Map Hounsfield units to display intensities with a centre and width chosen for the tissue of interest; several windows become image channels." },
  { id: "2-5d-slices", name: "2.5D slice stacking", group: "representation", description: "Feed neighbouring slices of a volume as the channels of a 2D image, giving a 2D network some depth context at 2D cost." },
  { id: "3d-volumes", name: "Native 3D volumes", group: "representation", description: "Process the volume with 3D convolutions or 3D attention." },
  { id: "wsi-tiling", name: "Whole-slide tiling", group: "representation", description: "Cut gigapixel pathology slides into tiles, keep the tiles that contain tissue, and model the set." },
  { id: "spectrograms", name: "Spectrograms and scalograms", group: "representation", description: "Turn a 1D signal into a 2D time-frequency image (STFT, mel, wavelet, superlet) so image models can read it." },
  { id: "landmark-sequences", name: "Landmark sequences", group: "representation", description: "Represent video as a sequence of body, hand and face keypoints instead of pixels." },
  { id: "molecular-strings", name: "Molecular and biological strings", group: "representation", description: "Treat SMILES, RNA or protein sequences as token sequences." },
  { id: "pair-features", name: "Pairwise feature maps", group: "representation", description: "Precomputed pair matrices (such as RNA base-pair probabilities) injected into attention as a bias." },
  { id: "pretrained-embeddings", name: "Pretrained embeddings", group: "representation", description: "Use a frozen foundation model (protein language model, pathology ViT) as a feature extractor." },

  // Architectures
  { id: "cnn-backbones", name: "CNN backbones", group: "architecture", description: "ResNet, SE-ResNeXt, EfficientNet and ConvNeXt families, usually ImageNet-pretrained." },
  { id: "unet", name: "U-Net and encoder-decoders", group: "architecture", description: "An encoder that downsamples, a decoder that upsamples, and skip connections that carry detail across." },
  { id: "nnu-net", name: "nnU-Net", group: "architecture", description: "A self-configuring U-Net framework that sets preprocessing, patch size and training schedule from dataset properties." },
  { id: "vision-transformers", name: "Vision transformers", group: "architecture", description: "Attention-based image models (ViT, SegFormer, CoaT, MaxViT, EVA)." },
  { id: "sequence-models", name: "Sequence models over slices or frames", group: "architecture", description: "LSTM, GRU or transformer layers that read a sequence of per-slice or per-frame embeddings." },
  { id: "transformers", name: "Transformer encoders and decoders", group: "architecture", description: "Self-attention stacks for sequences, with positional schemes (RoPE, ALiBi, dynamic bias) that decide length generalisation." },
  { id: "conformers", name: "Conformer and Squeezeformer", group: "architecture", description: "Blocks that interleave self-attention with convolution, developed for speech and reused for sequences of landmarks and nucleotides." },
  { id: "gradient-boosting", name: "Gradient-boosted trees", group: "architecture", description: "LightGBM, XGBoost, CatBoost and GPU multi-output boosting." },
  { id: "graph-networks", name: "Graph neural networks", group: "architecture", description: "Message passing over a graph such as an ontology." },
  { id: "large-language-models", name: "Large language models", group: "architecture", description: "Decoder-only transformers fine-tuned for reasoning." },

  // Training
  { id: "pseudo-labelling", name: "Pseudo-labelling", group: "training", description: "Label unlabelled or test data with a trained model, then train on those labels." },
  { id: "label-denoising", name: "Label denoising", group: "training", description: "Find and remove or soften training labels that disagree strongly with out-of-fold predictions." },
  { id: "soft-labels", name: "Soft labels and label smoothing", group: "training", description: "Train against probabilities rather than hard 0/1 targets." },
  { id: "auxiliary-losses", name: "Auxiliary losses", group: "training", description: "Add side tasks (segmentation, metadata, reversed sequences) that shape the representation." },
  { id: "imbalance-handling", name: "Class-imbalance handling", group: "training", description: "Weighted sampling, class weights, focal loss and undersampling for rare positives." },
  { id: "segmentation-losses", name: "Dice, Tversky and Lovász losses", group: "training", description: "Overlap-based losses that optimise segmentation quality directly." },
  { id: "mixing-augmentation", name: "Mixup and CutMix", group: "training", description: "Blend two samples and their labels to regularise." },
  { id: "domain-augmentation", name: "Domain-specific augmentation", group: "training", description: "Augmentations derived from how the data is produced: stain variation, finger dropout, left-right swaps with label swaps." },
  { id: "self-supervised-pretraining", name: "Self-supervised and foundation-model pretraining", group: "training", description: "Learn representations without labels (masked modelling, iBOT) before supervised training." },
  { id: "external-data", name: "External data", group: "training", description: "Public datasets beyond the competition release." },
  { id: "weight-averaging", name: "EMA and SWA", group: "training", description: "Average weights over training to reach flatter, better-calibrated solutions." },
  { id: "llm-fine-tuning", name: "LLM fine-tuning and merging", group: "training", description: "Supervised fine-tuning on generated solutions and linear merging of checkpoints." },

  // Inference
  { id: "ensembling", name: "Ensembling", group: "inference", description: "Average several models; rank or quantile normalisation when their outputs are on different scales." },
  { id: "tta", name: "Test-time augmentation", group: "inference", description: "Predict on transformed copies of the input and average." },
  { id: "threshold-tuning", name: "Threshold and post-processing", group: "inference", description: "Choose decision thresholds, remove small components, enforce label consistency." },
  { id: "coarse-to-fine", name: "Coarse-to-fine inference", group: "inference", description: "A cheap model finds a region; an expensive model runs only there." },
  { id: "model-compression", name: "Quantisation and export", group: "inference", description: "FP16/INT8/FP8, TensorRT, OpenVINO, TFLite: making the model fit the hardware budget." },

  // Validation
  { id: "grouped-cv", name: "Grouped cross-validation", group: "validation", description: "Split by patient, signer, experiment or building block so the same subject never appears on both sides." },
  { id: "leaderboard-discipline", name: "Leaderboard discipline", group: "validation", description: "Techniques for not overfitting a small public test set: paired tests across seeds, reduced degrees of freedom, zeroing leaked rows." },
];

export const techniqueById = new Map(techniques.map((t) => [t.id, t]));
