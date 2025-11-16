import api from "../api";

const baseUrl = (import.meta as any).env.VITE_TEXT_TO_ACTION_SERVICE_URL;
const token = (import.meta as any).env.VITE_TEXT_TO_ACTION_TOKEN;

export const TextToActionService = () => {
  const getModels = async () => {
    const response = await api.get(`${baseUrl}/text-to-action/models`, {
      params: {
        model_type: "gguf",
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const textToAction = async (text: string) => {
    const response = await api.post(
      `${baseUrl}/text-to-action`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  };

  return {
    textToAction,
    getModels,
  };
};
