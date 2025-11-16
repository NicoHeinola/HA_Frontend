import api from "../api";

const baseUrl = (import.meta as any).env.VITE_BACKEND_SERVICE_URL;
const token = (import.meta as any).env.VITE_BACKEND_TOKEN;

export const BackendService = () => {
  const runAction = async (data: Record<string, any>) => {
    const response = await api.post(`${baseUrl}/action-runner/run-action`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const playbackAnswer = async (aiAnswer: string) => {
    const response = await api.post(
      `${baseUrl}/ai/playback`,
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
