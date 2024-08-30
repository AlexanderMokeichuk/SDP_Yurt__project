import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUserFromDb } from '~/types/user';
import axiosApi from '~/axiosApi';

export const fetchUsers = createAsyncThunk<IUserFromDb[], undefined>('users/fetchAll', async () => {
  try {
    const { data: response } = await axiosApi.get<IUserFromDb[]>('/users');
    return response;
  } catch (e) {
    return [];
  }
});

export const blockUserId = createAsyncThunk<IUserFromDb | null, string>(
  'users/blockUser',
  async (id) => {
    try {
      const { data: response } = await axiosApi.patch<IUserFromDb | null>(
        `/users/toggleBlockUser/${id}`,
      );
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const roleChange = createAsyncThunk<IUserFromDb | null, string>(
  'users/roleChange',
  async (id) => {
    try {
      const { data: response } = await axiosApi.patch<IUserFromDb>(`/users/toggleRoleChange/${id}`);
      return response;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);
