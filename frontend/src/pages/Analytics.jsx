import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import toast from "react-hot-toast";
import { getAnalytics, getFilterOptions } from "../services/predictionService";
import ChartCard from "../components/ChartCard";
import Skeleton from "../components/Skeleton";

const COLORS = ["#0F3D2E", "#C99A3D", "#3B7A9E", "#B85C38", "#7FA189", "#8B5E9E"];

function toChartArray(obj) {
  return Object.entries(obj || {}).map(([name, value]) => ({ name, value }));
}

function Analytics() {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState(null);
  const [filters, setFilters] = useState({ crop: "", region: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilterOptions().then(setOptions).catch(() => toast.error("Failed to load filter options"));
  }, []);

  useEffect(() => {
    setLoading(true);
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v)
    );
    getAnalytics(activeFilters)
      .then(setData)
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-2">
        Data Analytics
      </h1>
      <p className="text-stone font-body mb-6">
        Explore how crop, region, and field conditions relate to yield outcomes.
      </p>

      {/* Filters */}
      {options && (
        <div className="flex gap-4 mb-6">
          <select
            value={filters.crop}
            onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
            className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body"
          >
            <option value="">All Crops</option>
            {options.crops.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body"
          >
            <option value="">All Regions</option>
            {options.regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {(filters.crop || filters.region) && (
            <button
              onClick={() => setFilters({ crop: "", region: "" })}
              className="px-4 py-2 rounded-lg text-sm font-body text-stone hover:text-rust transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : data?.error ? (
        <p className="text-stone font-body text-center py-12">{data.error}</p>
      ) : (
        <>
          <p className="text-xs text-stone font-body mb-4">
            Showing {data.total_records.toLocaleString()} records
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Average Yield by Crop">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={toChartArray(data.yield_by_crop)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0F3D2E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Average Yield by Region">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={toChartArray(data.yield_by_region)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#C99A3D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Average Yield by Soil Type">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={toChartArray(data.yield_by_soil)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B7A9E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Average Yield by Weather Condition">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={toChartArray(data.yield_by_weather)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B85C38" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Rainfall vs Yield">
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="Rainfall_mm" name="Rainfall (mm)" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="Yield_tons_per_hectare" name="Yield (t/ha)" tick={{ fontSize: 12 }} />
                  <ZAxis range={[20, 20]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={data.rainfall_temp_yield_scatter} fill="#0F3D2E" fillOpacity={0.4} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fertilizer & Irrigation Impact">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: "No Fertilizer", value: data.yield_by_fertilizer["False"] },
                    { name: "Fertilizer Used", value: data.yield_by_fertilizer["True"] },
                    { name: "No Irrigation", value: data.yield_by_irrigation["False"] },
                    { name: "Irrigation Used", value: data.yield_by_irrigation["True"] },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7FA189" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;