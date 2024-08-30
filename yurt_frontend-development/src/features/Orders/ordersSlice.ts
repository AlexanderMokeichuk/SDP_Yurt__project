import { IOrderFromDb } from '~/types/order';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { addComment, createOrder, fetchAllOrders, updateOrder } from '@orders/ordersThunks';

interface OrdersSlice {
  orders: IOrderFromDb[];
  ordersLoading: boolean;
  createLoading: boolean;
  addCommentLoading: boolean;
}

const InitialState: OrdersSlice = {
  orders: [],
  ordersLoading: false,
  createLoading: false,
  addCommentLoading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState: InitialState,
  reducers: {
    toggleCancelOrder: (state, { payload: id }) => {
      state.orders = state.orders.map((order) => {
        if (order._id === id) {
          order.canceled = !order.canceled;
          return order;
        }
        return order;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, { payload: newOrder }: PayloadAction<IOrderFromDb | null>) => {
          state.createLoading = false;
          if (newOrder) {
            state.orders.unshift(newOrder);
          }
        },
      )
      .addCase(createOrder.rejected, (state) => {
        state.createLoading = false;
      });
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, { payload: orders }: PayloadAction<IOrderFromDb[]>) => {
          state.orders = orders;
          state.ordersLoading = false;
        },
      )
      .addCase(fetchAllOrders.rejected, (state) => {
        state.ordersLoading = false;
      });
    builder
      .addCase(updateOrder.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(
        updateOrder.fulfilled,
        (state, { payload: updatedOrder }: PayloadAction<IOrderFromDb | null>) => {
          if (updatedOrder) {
            const updatedOrders = state.orders.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order,
            );
            state.orders = updatedOrders;
          }
          state.ordersLoading = false;
        },
      )
      .addCase(updateOrder.rejected, (state) => {
        state.ordersLoading = false;
      });
    builder
      .addCase(addComment.pending, (state) => {
        state.addCommentLoading = true;
      })
      .addCase(
        addComment.fulfilled,
        (state, { payload: updatedOrder }: PayloadAction<IOrderFromDb | null>) => {
          state.addCommentLoading = false;
          if (updatedOrder) {
            const updatedOrders = state.orders.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order,
            );
            state.orders = updatedOrders;
          }
        },
      )
      .addCase(addComment.rejected, (state) => {
        state.addCommentLoading = false;
      });
  },
});

export const { toggleCancelOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.ordersLoading;
export const selectOrdersAddCommentLoading = (state: RootState) => state.orders.addCommentLoading;
