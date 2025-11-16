import api from "../api";

const baseUrl = (import.meta as any).env.VITE_BACKEND_SERVICE_URL;
const token = (import.meta as any).env.VITE_BACKEND_TOKEN;

export const BackendService = () => {
  const runAction = async (action: string, params: Record<string, any>) => {
    const response = await api.post(
      `${baseUrl}/api/action-runner/run-action`,
      {
        action,
        params,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  };

  const playbackAnswer = async (aiAnswer: string) => {
    const response = await api.post(
      `${baseUrl}/api/ai/playback`,
      { ai_answer: aiAnswer },
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
    runAction,
    playbackAnswer,
  };
};
