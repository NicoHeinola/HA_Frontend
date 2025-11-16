import api from "../api";

const baseUrl = (import.meta as any).env.VITE_TEXT_TO_ACTION_SERVICE_URL;
const token = (import.meta as any).env.VITE_TEXT_TO_ACTION_TOKEN;

export const TextToActionActionService = () => {
  const getActions = async (params?: any) => {
    const response = await api.get(`${baseUrl}/actions`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const createAction = async (data: any) => {
    const response = await api.post(`${baseUrl}/actions`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const updateAction = async (id: number, data: any) => {
    const response = await api.put(`${baseUrl}/actions/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const deleteAction = async (id: number) => {
    const response = await api.delete(`${baseUrl}/actions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const deleteActions = async () => {
    const response = await api.delete(`${baseUrl}/actions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return {
    getActions,
    updateAction,
    deleteAction,
    deleteActions,
    createAction,
  };
};
