import api from "../api";
import { baseUrl as TTABaseURL, token as TTAToken } from "../text-to-action/TextToAction.service";

export const LogService = () => {
  const getTextToActionLogs = async () => {
    const response = await api.get(`${TTABaseURL}/logs`, {
      headers: {
        Authorization: `Bearer ${TTAToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  return {
    getTextToActionLogs,
  };
};
