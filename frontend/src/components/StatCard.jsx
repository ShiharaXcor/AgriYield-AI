function StatCard({ label, value, unit, icon: Icon, accent = "forest" }) {
  const accentClasses = {
    forest: "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage",
    gold: "bg-gold/10 text-gold dark:bg-gold/20",
    irrigation: "bg-irrigation/10 text-irrigation dark:bg-irrigation/20",
    rust: "bg-rust/10 text-rust dark:bg-rust/20",
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone font-body">{label}</p>
          <p className="text-3xl font-display font-semibold text-ink dark:text-canvas mt-2">
            {value}
            {unit && <span className="text-lg text-stone ml-1 font-body">{unit}</span>}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${accentClasses[accent]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;