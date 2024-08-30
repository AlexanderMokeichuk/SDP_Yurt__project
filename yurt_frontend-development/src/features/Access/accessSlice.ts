import { IUserFromDb } from '~/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { blockUserId, fetchUsers, roleChange } from '@access/accessThunks';

interface AccessSlice {
  users: IUserFromDb[];
  fetchLoading: boolean;
}

const InitialState: AccessSlice = {
  users: [],
  fetchLoading: false,
};

const accessSlice = createSlice({
  name: 'access',
  initialState: InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload: users }: PayloadAction<IUserFromDb[]>) => {
        state.fetchLoading = false;
        state.users = users;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder.addCase(
      blockUserId.fulfilled,
      (state, { payload: user }: PayloadAction<IUserFromDb | null>) => {
        state.fetchLoading = false;
        if (user) {
          const newUsers = state.users.filter((item) => {
            if (item._id === user._id) {
              item.blocked = user.blocked;
              return item;
            }
            return item;
          });
          state.users = newUsers;
        }
      },
    );

    builder
      .addCase(roleChange.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(
        roleChange.fulfilled,
        (state, { payload: user }: PayloadAction<IUserFromDb | null>) => {
          state.fetchLoading = false;
          if (user) {
            const newUsers = state.users.filter((item) => {
              if (item._id === user._id) {
                item.role = user.role;
                return item;
              }
              return item;
            });
            state.users = newUsers;
          }
        },
      )
      .addCase(roleChange.rejected, (state) => {
        state.fetchLoading = false;
      });
  },
});

export const accessReducer = accessSlice.reducer;

export const selectUsersList = (state: RootState) => state.access.users;
export const selectUsersFetchLoading = (state: RootState) => state.access.fetchLoading;
