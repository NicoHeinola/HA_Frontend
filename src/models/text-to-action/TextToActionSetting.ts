export enum TextToActionSettingType {
  String = "string",
}

export default interface TextToActionSetting {
  id?: number;
  key: string;
  value: string;
  type: TextToActionSettingType | string;
}
