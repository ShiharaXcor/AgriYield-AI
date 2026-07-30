import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import ModelPerformance from "./pages/ModelPerformance";
import DecisionSupport from "./pages/DecisionSupport";
import WhatIf from "./pages/WhatIf";
import HistoryPage from "./pages/HistoryPage";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="predict" element={<Prediction />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="model-performance" element={<ModelPerformance />} />
          <Route path="decision-support" element={<DecisionSupport />} />
          <Route path="what-if" element={<WhatIf />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;