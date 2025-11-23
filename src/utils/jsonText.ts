export const JSONTextToObject = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const objectToJSONString = (obj: any): string => {
  if (typeof obj === "string") {
    return obj;
  }

  try {
    return JSON.stringify(obj, null, "\t");
  } catch {
    return "";
  }
};

export const isValidJSON = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch {
    return false;
  }
};
