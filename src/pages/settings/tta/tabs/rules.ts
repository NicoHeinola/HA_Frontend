import { TextToActionSettingKey } from "@/models/text-to-action/TextToActionSetting";

export const rules = () => {
  const rules: any = {};

  rules[TextToActionSettingKey.PredictionTimeout] = [
    (v: number) => v >= 0 || "Minimum is 0",
    (v: number) => v <= 300 || "Maximum is 300",
  ];

  return rules;
};
