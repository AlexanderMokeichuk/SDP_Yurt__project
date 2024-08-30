import { ReactNode } from 'react';

export type TLanguage = 'ru' | 'kg';

export interface ILanguageCodes {
  ru: string | ReactNode;
  kg: string | ReactNode;
}

export interface ITranslate {
  name: string;
  translation: ILanguageCodes;
}
export interface IFeatureTranslation {
  name: string;
  data: ITranslate[];
}
