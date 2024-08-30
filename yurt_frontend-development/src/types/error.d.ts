import { InternalAxiosRequestConfig } from 'axios';
import { ILanguageCodes } from '~/types/language';

export interface IGlobalError {
  error: ILanguageCodes;
}

export interface IApiNikitaError {
  response: {
    data: {
      error: {
        description: string;
        status: number;
      };
    };
  };
}

export interface IApiError {
  response: {
    data: {
      error: string;
    };
    status: number;
  };
  config: InternalAxiosRequestConfig;
}

export interface IValidationError {
  error: {
    errors: Record<
      string,
      {
        name: string;
        message: string;
      }
    >;
    message: string;
    name: string;
    _message: string;
  };
}
