# Nolad writing standard

Reports and foundations are written as a scientific review: third person, declarative, precise. The sample that defines the standard is `packages/content/reports/rsna-intracranial-aneurysm-detection.mdx`.

## Order of information

- Context before method. Each report establishes the clinical or scientific problem, then the data, then the metric, then the solutions.
- Define every term before it is used. A reader who does not know nnU-Net, DBSCAN or ROC AUC meets a definition or a Foundation block first.
- The summary follows the order of an abstract: what the competition asked, what the winning solution does, one measured result.

## Titles and headings

- Report title: competition name and year only. No subtitle.
- Headings describe their content: "Clinical background", "Data", "Evaluation metric", "Winning solution", "Stage 1: coarse vessel segmentation", "Loss function", "Ablation study", "Second place: …", "Comparison with other competitions", "Compute and deployment", "Considerations for deployment".
- No coined labels or slogans ("vessel-first", "The split is the model", "The minimum useful version").

## Sentences

- No imperative task statements addressed to nobody ("Find aneurysms…"). Write "The competition asked participants to …".
- No staged setups and reveals ("The answer is …", "Here is the catch", "This is what made it hard").
- No rhetorical contrasts of the form "X, not Y" unless the contrast is itself the content.
- No meta statements of purpose ("This section explains …").
- No unsupported evaluative words ("crucial", "deliberately", "elegant", "plainly", "the turning point"). State the measurement instead: "removing it lowered the score from 0.902 to 0.794".
- Attribute claims: "the author reports", "the write-up states", or a citation.
- Vary sentence length naturally; do not group items in threes by habit.
- Past tense for what competitors did and found; present tense for how a method works.

## Equations

- Define every symbol, with its domain, next to the equation.
- Derive in steps. One transformation per displayed line, with the operation stated in words when it is not obvious.
- No fractions nested more than one level deep. Introduce named intermediate quantities instead (for example TP, FP, FN before a Tversky index).
- Give worked numbers where they help: voxel counts, class fractions, score differences.
- Use `\mathrm{}` for multi-letter names (AUC, TP, Dice), `\tfrac` for small inline fractions in display lines, and `\qquad` between parallel definitions.

## Figures

- A figure shows something the text states: a structure, a quantity, a step of a method. No decorative images.
- Figures are drawn for Nolad as SVG React components in `apps/web/src/components/figures/`, registered by id and placed with `<Diagram id="…" caption="…" />`. They use the `.dg-*` classes so they follow the light and dark themes.
- Figures from other sources are reproduced only under an open licence (for example CC BY) with a `credit`. Otherwise the report links to the figure in the original write-up or paper.
- Images from competition datasets are not hosted.
- Labels on the drawing are a few words; the explanation goes in the caption, which states what the figure shows. Numbers in a figure come from the write-ups and match the text.

## Code

- Quoted code comes from the winners' repositories and carries a `<Source>` link.
- Code written for Nolad is labelled "A Nolad illustration" and must not be presented as the authors' code.
