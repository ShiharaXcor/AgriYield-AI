function SelectField({ label, options, register, name, error }) {
  return (
    <div>
      <label className="block text-sm font-body text-stone mb-1.5">{label}</label>
      <select
        {...register(name, { required: `${label} is required` })}
        className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-ink dark:text-canvas font-body text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-rust text-xs mt-1 font-body">{error.message}</p>}
    </div>
  );
}

export default SelectField;