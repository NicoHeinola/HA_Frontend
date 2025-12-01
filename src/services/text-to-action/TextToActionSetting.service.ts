import api from "../api";

const baseUrl = (import.meta as any).env.VITE_TEXT_TO_ACTION_SERVICE_URL;
const token = (import.meta as any).env.VITE_TEXT_TO_ACTION_TOKEN;

export const TextToActionSettingService = () => {
  const getSettings = async (params?: any) => {
    const response = await api.get(`${baseUrl}/settings/`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const updateSetting = async (id: number, data: any) => {
    const response = await api.put(`${baseUrl}/settings/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const deleteSetting = async (id: number) => {
    const response = await api.delete(`${baseUrl}/settings/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const seedSettings = async (data: any) => {
    const response = await api.post(`${baseUrl}/settings/seed/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return {
    getSettings,
    updateSetting,
    deleteSetting,
    seedSettings,
  };
};
