/**
 * Finds a setting by its key in an array of settings
 * @param settings Array of settings objects
 * @param key The key to search for
 * @returns The setting object or undefined
 */
export const findSettingByKey = (settings: any[], key: string) => {
  return settings.find((s) => s.key === key);
};

/**
 * Updates a setting value by its key in an array of settings
 * @param settings Array of settings objects to update
 * @param key The key of the setting to update
 * @param value The new value to set
 */
export const updateSettingValue = (settings: any[], key: string, value: string) => {
  const setting = settings.find((s) => s.key === key);
  if (!setting) {
    return;
  }
  setting.value = value;
};
