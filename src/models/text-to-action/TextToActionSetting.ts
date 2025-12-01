export enum TextToActionSettingType {
  String = "string",
  Array = "array",
  Boolean = "boolean",
  Flaot = "float",
  Integer = "integer",
}

export enum TextToActionSettingKey {
  SystemPrompt = "system_prompt",
  PredictionTimeout = "prediction_timeout",
  DefaultModel = "default_model",
  AutoCacheModels = "auto_cache_models",
}

export default interface TextToActionSetting {
  id?: number;
  key: string;
  value: string | string[] | boolean | number;
  type: TextToActionSettingType | string;
}
