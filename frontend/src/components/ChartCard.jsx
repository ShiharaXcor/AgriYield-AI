function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
      <p className="text-sm font-medium text-ink dark:text-canvas font-body mb-4">{title}</p>
      {children}
    </div>
  );
}

export default ChartCard;