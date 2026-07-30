import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { predictYield } from "../services/predictionService";
import SelectField from "../components/SelectField";
import ToggleField from "../components/ToggleField";
import PredictionResult from "../components/PredictionResult";

const REGIONS = ["North", "South", "East", "West"];
const SOIL_TYPES = ["Sandy", "Clay", "Loam", "Silt", "Chalky", "Peaty"];
const CROPS = ["Maize", "Rice", "Wheat", "Barley", "Cotton", "Soybean"];
const WEATHER_CONDITIONS = ["Sunny", "Rainy", "Cloudy"];

function Prediction() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    try {
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
      const res = await predictYield(payload);
      setResult(res);
      toast.success("Prediction generated successfully");
    } catch (err) {
      toast.error("Prediction failed. Check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-2">
        Yield Prediction
      </h1>
      <p className="text-stone font-body mb-8">
        Enter your field conditions to forecast crop yield before harvest.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
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
            disabled={loading}
            className="w-full bg-forest hover:bg-forest/90 text-white font-body font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Predicting...
              </>
            ) : (
              "Predict Yield"
            )}
          </button>
        </form>

        {/* Result */}
        <div>
          {result ? (
            <PredictionResult result={result} />
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-black/10 dark:border-white/10 text-stone font-body text-sm text-center px-8">
              Fill out the form and click "Predict Yield" to see your forecast and recommendations here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;