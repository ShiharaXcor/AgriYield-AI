import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { ArrowRight, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { predictYield } from "../services/predictionService";
import SelectField from "../components/SelectField";
import ToggleField from "../components/ToggleField";
import SliderField from "../components/SliderField";

const REGIONS = ["North", "South", "East", "West"];
const SOIL_TYPES = ["Sandy", "Clay", "Loam", "Silt", "Chalky", "Peaty"];
const CROPS = ["Maize", "Rice", "Wheat", "Barley", "Cotton", "Soybean"];
const WEATHER_CONDITIONS = ["Sunny", "Rainy", "Cloudy"];

function WhatIf() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [scenarioA, setScenarioA] = useState(null); // set once the farmer submits their real baseline
  const [scenarioB, setScenarioB] = useState(null);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  // Step 1: Farmer submits their real current field conditions as the baseline
  const onSubmitBaseline = async (data) => {
    const payload = {
      Region: data.Region,
      Soil_Type: data.Soil_Type,
      Crop: data.Crop,
      Rainfall_mm: parseFloat(data.Rainfall_mm),
      Temperature_Celsius: parseFloat(data.Temperature_Celsius),
      Fertilizer_Used: data.Fertilizer_Used,
      Irrigation_Used: data.Irrigation_Used,
      Weather_Condition: data.Weather_Condition,
      Days_to_Harvest: parseInt(data.Days_to_Harvest),
    };

    setLoadingA(true);
    try {
      const res = await predictYield(payload);
      setScenarioA(payload);
      setResultA(res);
      setScenarioB({ ...payload }); // Scenario B starts as a copy of the real baseline
      setResultB(res);
      toast.success("Baseline set — now adjust Scenario B to compare changes");
    } catch {
      toast.error("Could not predict baseline. Check your inputs.");
    } finally {
      setLoadingA(false);
    }
  };

  // Step 2: Debounced live prediction whenever Scenario B changes
  const debouncedPredictB = useMemo(
    () =>
      debounce(async (scenario) => {
        setLoadingB(true);
        try {
          const res = await predictYield(scenario);
          setResultB(res);
        } catch {
          toast.error("Failed to predict Scenario B");
        } finally {
          setLoadingB(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    if (scenarioB) debouncedPredictB(scenarioB);
  }, [scenarioB, debouncedPredictB]);

  const updateB = (field, value) => setScenarioB((prev) => ({ ...prev, [field]: value }));

  const diff = resultA && resultB ? resultB.predicted_yield - resultA.predicted_yield : null;
  const percentChange = resultA && diff !== null ? ((diff / resultA.predicted_yield) * 100).toFixed(1) : null;

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-2">
        What-if Analysis
      </h1>
      <p className="text-stone font-body mb-6">
        Set your farm's current conditions, then test changes to see their real impact on yield.
      </p>

      {!scenarioA ? (
        /* Step 1: Baseline form */
        <div className="max-w-2xl">
          <div className="bg-irrigation/5 dark:bg-irrigation/10 border border-irrigation/20 rounded-2xl p-5 mb-6">
            <p className="text-sm font-body text-ink dark:text-canvas leading-relaxed">
              <span className="font-medium">Step 1 of 2:</span> Enter your field's current
              conditions below. This becomes your baseline — afterward, you'll be able to test
              changes like adding irrigation or expecting less rainfall, and see the yield impact instantly.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmitBaseline)}
            className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Region" name="Region" options={REGIONS} register={register} error={errors.Region} />
              <SelectField label="Soil Type" name="Soil_Type" options={SOIL_TYPES} register={register} error={errors.Soil_Type} />
            </div>

            <SelectField label="Crop" name="Crop" options={CROPS} register={register} error={errors.Crop} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body text-stone mb-1.5">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("Rainfall_mm", { required: true, min: 0, max: 2000 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-ink dark:text-canvas font-body text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  placeholder="e.g. 450"
                />
              </div>
              <div>
                <label className="block text-sm font-body text-stone mb-1.5">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("Temperature_Celsius", { required: true, min: -10, max: 60 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-ink dark:text-canvas font-body text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  placeholder="e.g. 24"
                />
              </div>
            </div>

            <SelectField label="Weather Condition" name="Weather_Condition" options={WEATHER_CONDITIONS} register={register} error={errors.Weather_Condition} />

            <div>
              <label className="block text-sm font-body text-stone mb-1.5">Days to Harvest</label>
              <input
                type="number"
                {...register("Days_to_Harvest", { required: true, min: 1, max: 365 })}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark text-ink dark:text-canvas font-body text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                placeholder="e.g. 110"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ToggleField label="Fertilizer Used" name="Fertilizer_Used" register={register} />
              <ToggleField label="Irrigation Used" name="Irrigation_Used" register={register} />
            </div>

            <button
              type="submit"
              disabled={loadingA}
              className="w-full bg-forest hover:bg-forest/90 text-white font-body font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loadingA ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Setting baseline...
                </>
              ) : (
                "Set as My Baseline"
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Step 2: Comparison view */
        <div>
          <div className="bg-irrigation/5 dark:bg-irrigation/10 border border-irrigation/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <p className="text-sm font-body text-ink dark:text-canvas">
              <span className="font-medium">Step 2 of 2:</span> Adjust Scenario B below to test changes against your baseline.
            </p>
            <button
              onClick={() => { setScenarioA(null); setResultA(null); setResultB(null); }}
              className="text-sm font-body text-forest dark:text-gold hover:underline shrink-0"
            >
              Start over
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scenario A - the farmer's real baseline, now fixed */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
              <p className="text-xs font-medium text-stone font-body uppercase tracking-wide mb-1">
                Scenario A
              </p>
              <p className="text-lg font-display font-semibold text-ink dark:text-canvas mb-4">
                Your Current Farm
              </p>

              <div className="space-y-2 text-sm font-body text-stone mb-6">
                <p>Crop: <span className="text-ink dark:text-canvas">{scenarioA.Crop}</span></p>
                <p>Region: <span className="text-ink dark:text-canvas">{scenarioA.Region}</span></p>
                <p>Rainfall: <span className="text-ink dark:text-canvas">{scenarioA.Rainfall_mm}mm</span></p>
                <p>Temperature: <span className="text-ink dark:text-canvas">{scenarioA.Temperature_Celsius}°C</span></p>
                <p>Days to Harvest: <span className="text-ink dark:text-canvas">{scenarioA.Days_to_Harvest}</span></p>
                <p>Fertilizer: <span className="text-ink dark:text-canvas">{scenarioA.Fertilizer_Used ? "Yes" : "No"}</span></p>
                <p>Irrigation: <span className="text-ink dark:text-canvas">{scenarioA.Irrigation_Used ? "Yes" : "No"}</span></p>
              </div>

              <div className="bg-canvas dark:bg-white/5 rounded-xl p-4 text-center">
                <p className="text-xs text-stone font-body">Predicted Yield</p>
                <p className="text-3xl font-display font-semibold text-ink dark:text-canvas mt-1">
                  {resultA?.predicted_yield} t/ha
                </p>
              </div>
            </div>

            {/* Scenario B - adjustable, starts as a copy of A */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
              <p className="text-xs font-medium text-gold font-body uppercase tracking-wide mb-1">
                Scenario B
              </p>
              <p className="text-lg font-display font-semibold text-ink dark:text-canvas mb-4">
                What if I change...
              </p>

              <div className="space-y-5">
                <SliderField
                  label="Rainfall"
                  value={scenarioB.Rainfall_mm}
                  min={0}
                  max={1000}
                  step={10}
                  unit="mm"
                  onChange={(v) => updateB("Rainfall_mm", v)}
                />
                <SliderField
                  label="Temperature"
                  value={scenarioB.Temperature_Celsius}
                  min={-10}
                  max={45}
                  step={1}
                  unit="°C"
                  onChange={(v) => updateB("Temperature_Celsius", v)}
                />
                <SliderField
                  label="Days to Harvest"
                  value={scenarioB.Days_to_Harvest}
                  min={60}
                  max={150}
                  step={1}
                  unit=" days"
                  onChange={(v) => updateB("Days_to_Harvest", v)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-between px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark">
                    <span className="text-sm font-body text-ink dark:text-canvas">Fertilizer</span>
                    <input
                      type="checkbox"
                      checked={scenarioB.Fertilizer_Used}
                      onChange={(e) => updateB("Fertilizer_Used", e.target.checked)}
                      className="w-4 h-4 accent-forest"
                    />
                  </label>
                  <label className="flex items-center justify-between px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark">
                    <span className="text-sm font-body text-ink dark:text-canvas">Irrigation</span>
                    <input
                      type="checkbox"
                      checked={scenarioB.Irrigation_Used}
                      onChange={(e) => updateB("Irrigation_Used", e.target.checked)}
                      className="w-4 h-4 accent-forest"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-gold/10 rounded-xl p-4 text-center mt-6">
                <p className="text-xs text-stone font-body">Predicted Yield</p>
                <p className="text-3xl font-display font-semibold text-forest dark:text-gold mt-1">
                  {loadingB ? "..." : `${resultB?.predicted_yield ?? "-"} t/ha`}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          {resultA && resultB && (
            <div className="mt-8 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10">
              <p className="text-sm font-medium text-ink dark:text-canvas font-body mb-4">
                Comparison
              </p>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="text-center">
                  <p className="text-xs text-stone font-body">Scenario A</p>
                  <p className="text-2xl font-display font-semibold text-ink dark:text-canvas">
                    {resultA.predicted_yield} t/ha
                  </p>
                </div>
                <ArrowRight size={24} className="text-stone" />
                <div className="text-center">
                  <p className="text-xs text-stone font-body">Scenario B</p>
                  <p className="text-2xl font-display font-semibold text-forest dark:text-gold">
                    {resultB.predicted_yield} t/ha
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium ${
                  diff >= 0 ? "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage" : "bg-rust/10 text-rust"
                }`}>
                  {diff >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {diff >= 0 ? "+" : ""}{diff?.toFixed(3)} t/ha ({percentChange}%)
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WhatIf;