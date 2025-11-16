export const rules = () => {
  const rules: any = {};

  rules["name"] = [
    (v: string) => !!v || "Name is required",
    (v: string) => (v && v.length <= 200) || "Name must be less than 200 characters",
  ];

  return rules;
};
