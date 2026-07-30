function ToggleField({ label, register, name }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark">
      <span className="text-sm font-body text-ink dark:text-canvas">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" {...register(name)} className="sr-only peer" />
        <div className="w-11 h-6 bg-black/10 dark:bg-white/10 rounded-full peer peer-checked:bg-forest transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
      </label>
    </div>
  );
}

export default ToggleField;