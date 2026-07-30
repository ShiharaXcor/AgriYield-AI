import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  BarChart3,
  Brain,
  Lightbulb,
  SlidersHorizontal,
  History,
  Info,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/predict", label: "Yield Prediction", icon: Sprout },
  { to: "/analytics", label: "Data Analytics", icon: BarChart3 },
  { to: "/model-performance", label: "Model Performance", icon: Brain },
  { to: "/decision-support", label: "Decision Support", icon: Lightbulb },
  { to: "/what-if", label: "What-if Analysis", icon: SlidersHorizontal },
  { to: "/history", label: "Prediction History", icon: History },
  { to: "/about", label: "About", icon: Info },
];

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-forest text-white flex flex-col fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-display font-semibold">AgriYield AI</h1>
        <p className="text-xs text-white/60 mt-1 font-body">Crop Intelligence Platform</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                isActive
                  ? "bg-gold text-forest font-medium"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50 font-body">
        v1.0.0
      </div>
    </aside>
  );
}

export default Sidebar;