import { Droplets, TestTube, Bug, Warehouse, Truck, Users, Thermometer, CheckCircle2 } from "lucide-react";

const iconMap = [
  { keyword: "irrigation", icon: Droplets, accent: "irrigation" },
  { keyword: "soil testing", icon: TestTube, accent: "gold" },
  { keyword: "pest", icon: Bug, accent: "rust" },
  { keyword: "storage", icon: Warehouse, accent: "forest" },
  { keyword: "transportation", icon: Truck, accent: "forest" },
  { keyword: "labor", icon: Users, accent: "forest" },
  { keyword: "heat", icon: Thermometer, accent: "rust" },
];

const accentClasses = {
  forest: "bg-forest/10 text-forest dark:bg-forest/20 dark:text-sage",
  gold: "bg-gold/10 text-gold",
  irrigation: "bg-irrigation/10 text-irrigation",
  rust: "bg-rust/10 text-rust",
};

function getIconFor(text) {
  const lower = text.toLowerCase();
  const match = iconMap.find((m) => lower.includes(m.keyword));
  return match || { icon: CheckCircle2, accent: "forest" };
}

function RecommendationCard({ text }) {
  const { icon: Icon, accent } = getIconFor(text);

  return (
    <div className="flex items-start gap-4 bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-black/5 dark:border-white/10">
      <div className={`p-2.5 rounded-xl shrink-0 ${accentClasses[accent]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-body text-ink dark:text-canvas leading-relaxed pt-1.5">{text}</p>
    </div>
  );
}

export default RecommendationCard;