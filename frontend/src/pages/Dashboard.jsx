import { useEffect, useState } from "react";
import { Droplets, Thermometer, Sprout, Brain } from "lucide-react";
import toast from "react-hot-toast";
import { getDashboardData } from "../services/predictionService";
import StatCard from "../components/StatCard";
import Skeleton from "../components/Skeleton";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-forest rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-semibold">Welcome to AgriYield AI</h1>
          <p className="text-white/70 mt-2 font-body max-w-2xl">
            Predict crop yield before harvest, and turn data into practical decisions —
            from irrigation planning to storage and transportation logistics.
          </p>
        </div>
        {/* Decorative contour-line signature motif */}
        <svg className="absolute -right-10 -bottom-16 opacity-10" width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="60" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="150" r="90" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="150" r="120" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="150" r="150" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {error && (
        <div className="bg-rust/10 text-rust rounded-xl p-4 mb-6 font-body text-sm">
          Could not connect to the backend. Make sure the API server is running.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard
              label="Total Predictions"
              value={data?.total_predictions ?? 0}
              icon={Sprout}
              accent="forest"
            />
            <StatCard
              label="Average Yield"
              value={data?.average_yield ?? 0}
              unit="t/ha"
              icon={Brain}
              accent="gold"
            />
            <StatCard
              label="Average Rainfall"
              value={data?.average_rainfall ?? 0}
              unit="mm"
              icon={Droplets}
              accent="irrigation"
            />
            <StatCard
              label="Average Temperature"
              value={data?.average_temperature ?? 0}
              unit="°C"
              icon={Thermometer}
              accent="rust"
            />
          </>
        )}
      </div>

      {/* Best performing model + recent predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
          <p className="text-sm text-stone font-body">Best Performing Model</p>
          {loading ? (
            <Skeleton className="h-8 mt-3 w-32" />
          ) : (
            <p className="text-2xl font-display font-semibold text-forest dark:text-gold mt-2">
              {data?.best_performing_model ?? "N/A"}
            </p>
          )}
          <p className="text-xs text-stone mt-2 font-body">
            Selected based on R² score across validated models
          </p>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
          <p className="text-sm text-stone font-body mb-4">Recent Predictions</p>

          {loading ? (
            <Skeleton className="h-40" />
          ) : data?.recent_predictions?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left text-stone border-b border-black/5 dark:border-white/10">
                    <th className="pb-2 font-medium">Crop</th>
                    <th className="pb-2 font-medium">Region</th>
                    <th className="pb-2 font-medium">Yield</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_predictions.map((p) => (
                    <tr key={p.id} className="border-b border-black/5 dark:border-white/5 last:border-0">
                      <td className="py-3 text-ink dark:text-canvas">{p.crop}</td>
                      <td className="py-3 text-stone">{p.region}</td>
                      <td className="py-3 text-ink dark:text-canvas font-mono">{p.predicted_yield} t/ha</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.yield_category === "High" || p.yield_category === "Very High"
                              ? "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage"
                              : p.yield_category === "Low"
                              ? "bg-rust/10 text-rust"
                              : "bg-gold/10 text-gold"
                          }`}
                        >
                          {p.yield_category}
                        </span>
                      </td>
                      <td className="py-3 text-stone text-xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-stone text-sm font-body py-8 text-center">
              No predictions yet. Head to the Yield Prediction page to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;