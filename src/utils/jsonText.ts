export const JSONTextToObject = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

export const objectToJSONString = (obj: any): string => {
  if (typeof obj === "string") {
    return obj;
  }

  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return "";
  }
};

export const isValidJSON = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
};
