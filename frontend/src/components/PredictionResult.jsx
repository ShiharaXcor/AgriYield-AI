import { Sprout, Gauge, Cpu, Clock } from "lucide-react";

const categoryColors = {
  Low: "bg-rust/10 text-rust",
  Medium: "bg-gold/10 text-gold",
  High: "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage",
  "Very High": "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage",
};

function PredictionResult({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-stone font-body">Predicted Yield</p>
          <p className="text-4xl font-display font-semibold text-forest dark:text-gold mt-1">
            {result.predicted_yield} <span className="text-lg text-stone">t/ha</span>
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium font-body ${categoryColors[result.yield_category]}`}>
          {result.yield_category}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Gauge size={18} className="mx-auto text-stone mb-1" />
          <p className="text-xs text-stone font-body">Confidence</p>
          <p className="text-sm font-medium text-ink dark:text-canvas font-body">{result.confidence}</p>
        </div>
        <div className="text-center">
          <Cpu size={18} className="mx-auto text-stone mb-1" />
          <p className="text-xs text-stone font-body">Model Used</p>
          <p className="text-sm font-medium text-ink dark:text-canvas font-body">{result.model_used}</p>
        </div>
        <div className="text-center">
          <Clock size={18} className="mx-auto text-stone mb-1" />
          <p className="text-xs text-stone font-body">Prediction Time</p>
          <p className="text-sm font-medium text-ink dark:text-canvas font-body">{result.prediction_time_ms}ms</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink dark:text-canvas font-body mb-3 flex items-center gap-2">
          <Sprout size={16} className="text-forest dark:text-sage" />
          Recommendations
        </p>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li
              key={i}
              className="text-sm text-stone font-body bg-canvas dark:bg-white/5 rounded-lg px-4 py-2.5"
            >
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PredictionResult;