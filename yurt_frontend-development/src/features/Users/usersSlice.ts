import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteAvatar, editProfile, login, logout } from './usersThunks';
import { IRegisterResponse, IUserFromDb } from '~/types/user';
import { IGlobalError } from '~/types/error';
import { RootState } from '~/app/store';
import { TLanguage } from '~/types/language';

interface UsersState {
  user: IRegisterResponse | null;
  loginLoading: boolean;
  loginError: IGlobalError | null;
  editLoading: boolean;
  language: TLanguage;
}

const initialState: UsersState = {
  user: null,
  loginLoading: false,
  loginError: null,
  editLoading: false,
  language: 'ru',
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    updateState: (state, { payload: response }: PayloadAction<IRegisterResponse>) => {
      state.user = response;
    },
    changeLanguage: (state) => {
      if (state.language === 'ru') {
        state.language = 'kg';
      } else {
        state.language = 'ru';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, { payload: user }: PayloadAction<IRegisterResponse>) => {
        state.user = user;
        state.loginLoading = false;
        state.loginError = null;
      })
      .addCase(
        login.rejected,
        (state, { payload: error }: PayloadAction<IGlobalError | undefined>) => {
          state.loginError = error ?? null;
          state.loginLoading = false;
        },
      );

    builder
      .addCase(logout.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loginLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loginLoading = false;
      });

    builder
      .addCase(editProfile.pending, (state) => {
        state.editLoading = true;
      })
      .addCase(
        editProfile.fulfilled,
        (state, { payload: user }: PayloadAction<IUserFromDb | null>) => {
          state.editLoading = false;
          if (user && state.user) {
            state.user.user = user;
          }
        },
      )
      .addCase(editProfile.rejected, (state) => {
        state.editLoading = false;
      });

    builder
      .addCase(deleteAvatar.pending, (state) => {
        state.editLoading = true;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        if (state.user) {
          state.user.user.image = null;
          state.editLoading = false;
        }
      })
      .addCase(deleteAvatar.rejected, (state) => {
        state.editLoading = false;
      });
  },
});

export const { unsetUser, updateState, changeLanguage } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectUserEditLoading = (state: RootState) => state.users.editLoading;
export const selectLanguage = (state: RootState) => state.users.language;
