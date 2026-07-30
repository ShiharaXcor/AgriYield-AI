import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Download, FileText, ArrowUpDown } from "lucide-react";
import { getHistory, deletePrediction, exportCSV, exportPDF } from "../services/predictionService";
import Skeleton from "../components/Skeleton";

function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(500, 0);
      setRecords(data);
    } catch {
      toast.error("Failed to load prediction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePrediction(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Prediction deleted");
    } catch {
      toast.error("Failed to delete prediction");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const uniqueCrops = useMemo(
    () => [...new Set(records.map((r) => r.crop))].sort(),
    [records]
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...records];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.crop.toLowerCase().includes(lower) ||
          r.region.toLowerCase().includes(lower) ||
          r.soil_type.toLowerCase().includes(lower)
      );
    }

    if (cropFilter) {
      result = result.filter((r) => r.crop === cropFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [records, search, cropFilter, sortField, sortDir]);

  const SortHeader = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="pb-2 font-medium cursor-pointer select-none hover:text-ink dark:hover:text-canvas transition-colors"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown size={12} className={sortField === field ? "opacity-100" : "opacity-30"} />
      </span>
    </th>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-1">
            Prediction History
          </h1>
          <p className="text-stone font-body text-sm">
            {filteredAndSorted.length} of {records.length} predictions
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-white/5 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-white/5 transition-colors"
          >
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            placeholder="Search by crop, region, or soil type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body text-ink dark:text-canvas focus:outline-none focus:ring-2 focus:ring-forest/40"
          />
        </div>

        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-sm font-body text-ink dark:text-canvas"
        >
          <option value="">All Crops</option>
          {uniqueCrops.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <p className="text-stone font-body text-center py-16 text-sm">
            No predictions found. Try adjusting your search or filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-stone border-b border-black/5 dark:border-white/10 bg-canvas dark:bg-white/5">
                  <SortHeader field="crop"><span className="px-6 py-3 block">Crop</span></SortHeader>
                  <th className="pb-2 pt-3 font-medium">Region</th>
                  <th className="pb-2 pt-3 font-medium">Soil Type</th>
                  <SortHeader field="predicted_yield">Yield</SortHeader>
                  <th className="pb-2 pt-3 font-medium">Category</th>
                  <th className="pb-2 pt-3 font-medium">Model</th>
                  <SortHeader field="created_at">Date</SortHeader>
                  <th className="pb-2 pt-3 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((r) => (
                  <tr key={r.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-canvas/50 dark:hover:bg-white/5">
                    <td className="py-3 pl-6 text-ink dark:text-canvas font-medium">{r.crop}</td>
                    <td className="py-3 text-stone">{r.region}</td>
                    <td className="py-3 text-stone">{r.soil_type}</td>
                    <td className="py-3 text-ink dark:text-canvas font-mono">{r.predicted_yield} t/ha</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.yield_category === "High" || r.yield_category === "Very High"
                            ? "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage"
                            : r.yield_category === "Low"
                            ? "bg-rust/10 text-rust"
                            : "bg-gold/10 text-gold"
                        }`}
                      >
                        {r.yield_category}
                      </span>
                    </td>
                    <td className="py-3 text-stone text-xs">{r.model_used}</td>
                    <td className="py-3 text-stone text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 rounded-lg hover:bg-rust/10 text-stone hover:text-rust transition-colors"
                        aria-label="Delete prediction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;