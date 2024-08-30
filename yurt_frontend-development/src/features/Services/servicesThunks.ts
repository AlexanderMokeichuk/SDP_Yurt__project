import axiosApi from '~/axiosApi';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IService, IServiceFromDb, IServiceMutation } from '~/types/service';
import axios from 'axios';

export const createService = createAsyncThunk<IServiceFromDb | null, IServiceMutation>(
  'services/create',
  async (service) => {
    try {
      const { data: response } = await axiosApi.post<IServiceFromDb>('/services', service);
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const fetchAllServices = createAsyncThunk<IService[]>(
  'services/fetchAllServices',
  async () => {
    try {
      const { data: response } = await axiosApi.get<IService[]>('/services');
      return response;
    } catch (e) {
      return [];
    }
  },
);

export const fetchUnblockedService = createAsyncThunk<IService[], string>(
  'services/fetchUnblockedService',
  async (query) => {
    try {
      const { data: response } = await axiosApi.get<IService[]>(
        `/services?unblockedServices=${query}`,
      );
      return response;
    } catch (e) {
      return [];
    }
  },
);

export const updateService = createAsyncThunk<
  IServiceFromDb | null,
  { id: string; serviceMutation: IServiceMutation }
>('services/updateService', async ({ id, serviceMutation }) => {
  try {
    const { data: response } = await axiosApi.patch<IServiceFromDb>(
      `/services/${id}`,
      serviceMutation,
    );
    return response;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.error('Error updating service:', e.response.data);
    }
    return null;
  }
});

export const toggleBlockService = createAsyncThunk<IService | null, string>(
  'services/toggleBlockService',
  async (id) => {
    try {
      const { data: response } = await axiosApi.patch<IService>(
        `/services/toggleBlockService/${id}`,
      );
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
