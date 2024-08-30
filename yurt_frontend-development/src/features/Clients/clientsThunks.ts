import { createAsyncThunk } from '@reduxjs/toolkit';
import { IClientFromDb } from '~/types/client';
import axiosApi from '~/axiosApi';

export const getClients = createAsyncThunk<IClientFromDb[], undefined>(
  'clients/getClients',
  async () => {
    try {
      const { data: response } = await axiosApi.get<IClientFromDb[]>('/clients/getClients');
      return response;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
);

export const toggleBlockClient = createAsyncThunk<IClientFromDb | null, string>(
  'clients/toggleBlockClient',
  async (id: string) => {
    try {
      const { data: response } = await axiosApi.patch<IClientFromDb>(
        `/clients/toggleBlockClient/${id}`,
      );
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
