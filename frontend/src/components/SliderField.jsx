function SliderField({ label, value, min, max, step, unit, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-body text-stone">{label}</label>
        <span className="text-sm font-mono text-ink dark:text-canvas font-medium">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-black/10 dark:bg-white/10 accent-forest cursor-pointer"
      />
    </div>
  );
}

export default SliderField;