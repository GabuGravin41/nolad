export function ScoreDots({ score, max = 5, label }: { score: number; max?: number; label?: string }) {
  return (
    <span className="score-dots" role="img" aria-label={`${label ?? "Score"}: ${score} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`score-dot${i < score ? " on" : ""}`} />
      ))}
    </span>
  );
}
