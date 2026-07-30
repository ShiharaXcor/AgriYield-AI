import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import toast from "react-hot-toast";
import { Trophy } from "lucide-react";
import { getModelPerformance, getFeatureImportance } from "../services/predictionService";
import ChartCard from "../components/ChartCard";
import Skeleton from "../components/Skeleton";

function ModelPerformance() {
  const [models, setModels] = useState(null);
  const [importance, setImportance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getModelPerformance(), getFeatureImportance()])
      .then(([modelData, importanceData]) => {
        setModels(modelData);
        setImportance(importanceData);
      })
      .catch(() => toast.error("Failed to load model performance data"))
      .finally(() => setLoading(false));
  }, []);

  const bestModel = models?.reduce((best, m) => (m.R2 > (best?.R2 ?? -Infinity) ? m : best), null);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-2">
        Model Performance
      </h1>
      <p className="text-stone font-body mb-6">
        Comparison of all trained models and what drives their predictions.
      </p>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <>
          {/* Best model banner */}
          {bestModel && (
            <div className="bg-forest rounded-2xl p-6 text-white mb-6 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Trophy size={24} className="text-gold" />
              </div>
              <div>
                <p className="text-sm text-white/70 font-body">Best Performing Model</p>
                <p className="text-xl font-display font-semibold">{bestModel.model_name}</p>
                <p className="text-sm text-white/70 font-body mt-1">
                  R² = {bestModel.R2?.toFixed(4)} · MAE = {bestModel.MAE?.toFixed(4)} · RMSE = {bestModel.RMSE?.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* Comparison table */}
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6 overflow-x-auto">
            <p className="text-sm font-medium text-ink dark:text-canvas font-body mb-4">
              Model Comparison
            </p>
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-stone border-b border-black/5 dark:border-white/10">
                  <th className="pb-2 font-medium">Model</th>
                  <th className="pb-2 font-medium">MAE</th>
                  <th className="pb-2 font-medium">RMSE</th>
                  <th className="pb-2 font-medium">R²</th>
                  <th className="pb-2 font-medium">CV R² (mean)</th>
                  <th className="pb-2 font-medium">Train Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {models?.map((m) => (
                  <tr
                    key={m.model_name}
                    className={`border-b border-black/5 dark:border-white/5 last:border-0 ${
                      m.model_name === bestModel?.model_name ? "bg-gold/5" : ""
                    }`}
                  >
                    <td className="py-3 font-medium text-ink dark:text-canvas">
                      {m.model_name}
                      {m.model_name === bestModel?.model_name && (
                        <span className="ml-2 text-xs text-gold">★ Best</span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-stone">{m.MAE?.toFixed(4)}</td>
                    <td className="py-3 font-mono text-stone">{m.RMSE?.toFixed(4)}</td>
                    <td className="py-3 font-mono text-stone">{m.R2?.toFixed(4)}</td>
                    <td className="py-3 font-mono text-stone">{m.CV_R2_Mean?.toFixed(4)}</td>
                    <td className="py-3 font-mono text-stone">{m.Train_Time_Sec?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* R2 comparison chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard title="R² Score by Model">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={models}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="model_name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="R2" fill="#0F3D2E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="MAE & RMSE by Model">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={models}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="model_name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="MAE" fill="#C99A3D" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#B85C38" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Feature importance */}
          {importance && (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
              <p className="text-sm font-medium text-ink dark:text-canvas font-body mb-4">
                Top Features Driving Predictions ({importance.model_explained})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-stone font-body mb-2">By SHAP Importance</p>
                  <ol className="space-y-1.5">
                    {importance.top_10_features_shap?.slice(0, 8).map((f, i) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-body">
                        <span className="text-stone w-5">{i + 1}.</span>
                        <span className="text-ink dark:text-canvas">{f}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-xs text-stone font-body mb-2">By Permutation Importance</p>
                  <ol className="space-y-1.5">
                    {importance.top_10_features_permutation?.slice(0, 8).map((f, i) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-body">
                        <span className="text-stone w-5">{i + 1}.</span>
                        <span className="text-ink dark:text-canvas">{f}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ModelPerformance;