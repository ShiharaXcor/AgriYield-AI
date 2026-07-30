import api from "./api";

export const predictYield = async (formData) => {
  const response = await api.post("/api/predict", formData);
  return response.data;
};

export const explainPrediction = async (formData) => {
  const response = await api.post("/api/predict/explain", formData);
  return response.data;
};

export const getModelPerformance = async () => {
  const response = await api.get("/api/model-performance");
  return response.data;
};

export const getFeatureImportance = async () => {
  const response = await api.get("/api/feature-importance");
  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

export const getHistory = async (limit = 50, skip = 0) => {
  const response = await api.get(`/api/history?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const deletePrediction = async (id) => {
  const response = await api.delete(`/api/history/${id}`);
  return response.data;
};

export const exportCSV = () => {
  window.open(`${api.defaults.baseURL}/api/export/csv`, "_blank");
};

export const exportPDF = () => {
  window.open(`${api.defaults.baseURL}/api/export/pdf`, "_blank");
};

export const getAnalytics = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/api/analytics${params ? `?${params}` : ""}`);
  return response.data;
};

export const getFilterOptions = async () => {
  const response = await api.get("/api/analytics/filter-options");
  return response.data;
};