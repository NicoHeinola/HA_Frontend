import api from "../api";

const baseUrl = (import.meta as any).env.VITE_TEXT_TO_ACTION_SERVICE_URL;
const token = (import.meta as any).env.VITE_TEXT_TO_ACTION_TOKEN;

export const TextToActionCachedModelService = () => {
  const getCachedModels = async () => {
    const response = await api.get(`${baseUrl}/cache`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const cacheModel = async (modelName: string) => {
    const response = await api.post(
      `${baseUrl}/cache`,
      {
        model_name: modelName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  };

  const deleteCachedModel = async (modelName: string) => {
    const response = await api.delete(`${baseUrl}/cache/${modelName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const deleteCachedModels = async () => {
    const response = await api.delete(`${baseUrl}/cache`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return {
    getCachedModels,
    cacheModel,
    deleteCachedModel,
    deleteCachedModels,
  };
};
