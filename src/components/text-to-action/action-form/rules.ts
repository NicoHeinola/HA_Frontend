import { isValidJSON } from "@/utils/jsonText";

export const rules = () => {
  const rules: any = {};

  rules["name"] = [
    (v: string) => !!v || "Name is required",
    (v: string) => (v && v.length <= 200) || "Name must be less than 200 characters",
  ];

  rules["meta"] = [(v: string) => isValidJSON(v) || "Meta must be valid JSON"];

  return rules;
};
