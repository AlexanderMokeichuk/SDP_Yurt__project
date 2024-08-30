import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosApi from '~/axiosApi';
import { IYurtFromDb, IYurtMutation } from '~/types/yurt';

export const fetchAllYurts = createAsyncThunk<IYurtFromDb[]>('yurts/fetchAllYurts', async () => {
  try {
    const { data: response } = await axiosApi.get<IYurtFromDb[]>('/yurts');
    return response;
  } catch (e) {
    return [];
  }
});

export const fetchUnblockedYurts = createAsyncThunk<IYurtFromDb[], string>(
  'yurts/fetchUnblockedYurts',
  async (query) => {
    try {
      const { data: response } = await axiosApi.get<IYurtFromDb[]>(
        `/yurts?unblockedYurts=${query}`,
      );
      return response;
    } catch (e) {
      return [];
    }
  },
);

export const createYurt = createAsyncThunk<IYurtFromDb, IYurtMutation>(
  'yurts/createYurt',
  async (yurtMutation) => {
    const formData = new FormData();

    const keys = Object.keys(yurtMutation) as (keyof IYurtMutation)[];
    keys.forEach((key) => {
      const value = yurtMutation[key];
      if (value !== null) {
        formData.append(key, value);
      }
    });

    const { data: response } = await axiosApi.post<IYurtFromDb>('/yurts', formData);
    return response;
  },
);

export const updateYurt = createAsyncThunk<
  IYurtFromDb,
  {
    id: string;
    yurtMutation: IYurtMutation;
  }
>('yurts/updateYurt', async ({ id, yurtMutation }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(yurtMutation) as (keyof IYurtMutation)[];
    keys.forEach((key) => {
      const value = yurtMutation[key];
      if (value !== null) {
        formData.append(key, value);
      }
    });
    const { data: response } = await axiosApi.patch<IYurtFromDb>(`/yurts/${id}`, formData);
    return response;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data);
    } else {
      return rejectWithValue({ error: 'An unknown error occurred' });
    }
  }
});

export const toggleBlockYurt = createAsyncThunk<IYurtFromDb | null, string>(
  'yurts/toggleBlockYurt',
  async (id) => {
    try {
      const { data: response } = await axiosApi.patch<IYurtFromDb>(`/yurts/toggleBlockYurt/${id}`);
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
