export enum SettingType {
  String = "string",
}

export default interface Setting {
  id?: number;
  key: string;
  value: string;
  type: SettingType | string;
}
