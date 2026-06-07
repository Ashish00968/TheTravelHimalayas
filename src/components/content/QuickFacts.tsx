interface QuickFactsProps {
  facts: { label: string; value: string }[];
}

export function QuickFacts({ facts }: QuickFactsProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Facts</h3>
      <dl className="space-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex justify-between items-center">
            <dt className="text-sm text-foreground/60">{fact.label}</dt>
            <dd className="text-sm font-medium text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
