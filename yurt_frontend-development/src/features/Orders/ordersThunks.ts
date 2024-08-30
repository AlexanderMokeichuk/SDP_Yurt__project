import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '~/axiosApi';
import { IOrderFromDb, IOrderToSend } from '~/types/order';

export const createOrder = createAsyncThunk<IOrderFromDb | null, IOrderToSend>(
  'orders/create',
  async (order) => {
    try {
      const { data: response } = await axiosApi.post<IOrderFromDb>('/orders', order);
      return response;
    } catch (error) {
      return null;
    }
  },
);

export const fetchAllOrders = createAsyncThunk<IOrderFromDb[]>(
  'orders/fetchAllOrders',
  async () => {
    try {
      const { data: response } = await axiosApi.get<IOrderFromDb[]>('/orders');
      return response;
    } catch (e) {
      return [];
    }
  },
);

export const updateOrder = createAsyncThunk<
  IOrderFromDb | null,
  { id: string; data: IOrderToSend }
>('orders/updateOne', async (updatedOrder) => {
  try {
    const { data: response } = await axiosApi.patch<IOrderFromDb>(
      `/orders/${updatedOrder.id}`,
      updatedOrder.data,
    );
    return response;
  } catch (e) {
    return null;
  }
});

export const addComment = createAsyncThunk<
  IOrderFromDb | null,
  { order: { comment: string; id: string } }
>('orders/addComment', async ({ order }) => {
  try {
    const newComment = {
      text: order.comment,
    };
    const { data: response } = await axiosApi.post<IOrderFromDb>(
      `/comments?orderID=${order.id}`,
      newComment,
    );
    return response;
  } catch (e) {
    return null;
  }
});
