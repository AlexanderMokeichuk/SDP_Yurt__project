import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse, isAxiosError } from 'axios';
import axiosApi from '~/axiosApi';
import {
  IEditRequest,
  IEditUserMutation,
  INewPassword,
  IRegisterResponse,
  IUserFromDb,
} from '~/types/user';
import { IGlobalError } from '~/types/error';
import { ILoginMutation } from '~/types/authentication';

export const login = createAsyncThunk<
  IRegisterResponse,
  ILoginMutation,
  {
    rejectValue: IGlobalError;
  }
>('users/login', async (loginMutation, { rejectWithValue }) => {
  try {
    const { data: response } = await axiosApi.post<IRegisterResponse>(
      '/users/login',
      loginMutation,
      { withCredentials: true },
    );
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 401) {
      return rejectWithValue(error.response.data as IGlobalError);
    }

    throw error;
  }
});

export const logout = createAsyncThunk<void, undefined>('users/logout', async () => {
  try {
    await axiosApi.delete('/users/logout', { withCredentials: true });
  } catch (e) {
    console.log(e);
  }
});

export const editProfile = createAsyncThunk<IUserFromDb | null, IEditRequest>(
  'users/editProfile',
  async (data) => {
    try {
      const formData = new FormData();

      const keys = Object.keys(data.edit) as (keyof IEditUserMutation)[];
      keys.forEach((key) => {
        const value = data.edit[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const { data: response } = await axiosApi.patch<IUserFromDb>(
        `users/editUser/${data.id}`,
        formData,
      );
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const changePassword = createAsyncThunk<void, INewPassword>(
  'users/newPassword',
  async (password, { rejectWithValue }) => {
    try {
      await axiosApi.post(
        `users/change-password-via-OTP?changeCurrentPassword=changePassword`,
        password,
      );
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 422) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  },
);

export const deleteAvatar = createAsyncThunk('users/deleteAvatar', async () => {
  try {
    await axiosApi.delete<AxiosResponse>('/users/deleteAvatar');
  } catch (e) {
    console.log(e);
  }
});
