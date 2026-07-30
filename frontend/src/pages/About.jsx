import { useEffect, useState } from "react";
import { Sprout, Database, Cpu, Layers, TrendingUp, ExternalLink } from "lucide-react";
import { getModelPerformance } from "../services/predictionService";

function About() {
  const [bestModel, setBestModel] = useState(null);

  useEffect(() => {
    getModelPerformance()
      .then((models) => {
        const best = models?.reduce((b, m) => (m.R2 > (b?.R2 ?? -Infinity) ? m : b), null);
        setBestModel(best);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-display font-semibold text-ink dark:text-canvas mb-2">
        About AgriYield AI
      </h1>
      <p className="text-stone font-body mb-8">
        Intelligent crop yield prediction and agricultural decision support.
      </p>

      {/* Business problem */}
      <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sprout size={20} className="text-forest dark:text-sage" />
          <h2 className="text-lg font-display font-semibold text-ink dark:text-canvas">The Problem</h2>
        </div>
        <p className="text-sm font-body text-stone leading-relaxed">
          Farmers and agricultural businesses often make critical decisions — harvest timing,
          storage planning, fertilizer and irrigation investment, labor allocation — without a
          reliable way to estimate crop yield ahead of harvest. AgriYield AI addresses this by
          predicting yield from field conditions before the season ends, and translating that
          prediction into practical, actionable guidance.
        </p>
      </section>

      {/* Dataset */}
      <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Database size={20} className="text-irrigation" />
          <h2 className="text-lg font-display font-semibold text-ink dark:text-canvas">Dataset</h2>
        </div>
        <p className="text-sm font-body text-stone leading-relaxed mb-3">
          Trained on ~1,000,000 records covering region, soil type, crop, rainfall, temperature,
          fertilizer and irrigation usage, weather condition, and days to harvest — with crop
          yield (tons/hectare) as the target variable.
        </p>
        <p className="text-sm font-body text-stone leading-relaxed">
          The data was cleaned (removing physically impossible negative yield values),
          explored through correlation and mutual information analysis, and enriched with
          engineered features such as rainfall intensity and a fertilizer × irrigation
          interaction term.
        </p>
      </section>

      {/* ML pipeline */}
      <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={20} className="text-gold" />
          <h2 className="text-lg font-display font-semibold text-ink dark:text-canvas">Machine Learning Pipeline</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-body">
          {["Data Cleaning", "EDA", "Feature Engineering", "Model Training", "Hyperparameter Tuning", "Cross-Validation", "Model Selection", "Explainable AI (SHAP)"].map((step) => (
            <div key={step} className="bg-canvas dark:bg-white/5 rounded-lg px-3 py-2 text-center text-ink dark:text-canvas text-xs">
              {step}
            </div>
          ))}
        </div>
        <p className="text-sm font-body text-stone leading-relaxed mt-4">
          Four models were trained and compared — Linear Regression, Decision Tree, XGBoost, and
          LightGBM — with hyperparameter tuning via randomized search and 5-fold cross-validation.
          {bestModel && (
            <> The best performing model was <span className="font-medium text-ink dark:text-canvas">{bestModel.model_name}</span>,
            {" "}with an R² of <span className="font-mono">{bestModel.R2?.toFixed(4)}</span>.</>
          )}
        </p>
      </section>

      {/* Architecture */}
      <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={20} className="text-plum" />
          <h2 className="text-lg font-display font-semibold text-ink dark:text-canvas">System Architecture</h2>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap font-mono text-xs">
          {["React Dashboard", "FastAPI REST API", "Prediction Service", "Trained ML Model", "MySQL Database"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <span className="px-3 py-2 bg-canvas dark:bg-white/5 rounded-lg text-ink dark:text-canvas">{s}</span>
              {i < arr.length - 1 && <span className="text-stone">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} className="text-rust" />
          <h2 className="text-lg font-display font-semibold text-ink dark:text-canvas">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-body">
          <div>
            <p className="font-medium text-ink dark:text-canvas mb-2">Frontend</p>
            <p className="text-stone">React, Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion</p>
          </div>
          <div>
            <p className="font-medium text-ink dark:text-canvas mb-2">Backend</p>
            <p className="text-stone">FastAPI, Pydantic, SQLAlchemy, MySQL, Joblib</p>
          </div>
          <div>
            <p className="font-medium text-ink dark:text-canvas mb-2">Machine Learning</p>
            <p className="text-stone">Scikit-learn, XGBoost, LightGBM, SHAP, Pandas, NumPy</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm font-body text-stone pt-2">
        <p>AgriYield AI v1.0.0</p>
        <a href="#" className="flex items-center gap-2 hover:text-ink dark:hover:text-canvas transition-colors">
          <ExternalLink size={16} /> View on GitHub
        </a>
      </div>
    </div>
  );
}

export default About;