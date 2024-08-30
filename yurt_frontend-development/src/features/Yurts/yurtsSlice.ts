import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createYurt,
  fetchAllYurts,
  fetchUnblockedYurts,
  toggleBlockYurt,
  updateYurt,
} from '@yurts/yurtsThunks';
import { RootState } from '~/app/store';
import { IYurtFromDb } from '~/types/yurt';

interface YurtState {
  allYurts: IYurtFromDb[];
  unblockedYurts: IYurtFromDb[];
  fetchLoading: boolean;
  createLoading: boolean;
  toggleBlockLoading: boolean;
}

const initialState: YurtState = {
  allYurts: [],
  unblockedYurts: [],
  fetchLoading: false,
  createLoading: false,
  toggleBlockLoading: false,
};

export const yurtsSlice = createSlice({
  name: 'yurts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllYurts.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(
        fetchAllYurts.fulfilled,
        (state, { payload: yurts }: PayloadAction<IYurtFromDb[]>) => {
          state.allYurts = yurts;
          state.fetchLoading = false;
        },
      )
      .addCase(fetchAllYurts.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(fetchUnblockedYurts.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(
        fetchUnblockedYurts.fulfilled,
        (state, { payload: yurts }: PayloadAction<IYurtFromDb[]>) => {
          state.unblockedYurts = yurts;
          state.fetchLoading = false;
        },
      )
      .addCase(fetchUnblockedYurts.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(createYurt.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createYurt.fulfilled, (state, { payload: newYurt }: PayloadAction<IYurtFromDb>) => {
        state.createLoading = false;
        state.allYurts.push(newYurt);
      })
      .addCase(createYurt.rejected, (state) => {
        state.createLoading = false;
      });
    builder
      .addCase(updateYurt.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(
        updateYurt.fulfilled,
        (state, { payload: updatedYurt }: PayloadAction<IYurtFromDb>) => {
          state.createLoading = false;
          state.allYurts = state.allYurts.map((item) =>
            item._id === updatedYurt._id ? updatedYurt : item,
          );
        },
      )
      .addCase(updateYurt.rejected, (state) => {
        state.createLoading = false;
      });
    builder
      .addCase(toggleBlockYurt.pending, (state) => {
        state.fetchLoading = true;
        state.toggleBlockLoading = true;
      })
      .addCase(
        toggleBlockYurt.fulfilled,
        (state, { payload: yurt }: PayloadAction<IYurtFromDb | null>) => {
          if (yurt) {
            state.allYurts = state.allYurts.map((item) => {
              if (item._id === yurt._id) {
                return yurt;
              }
              return item;
            });
          }
          state.toggleBlockLoading = false;
          state.fetchLoading = false;
        },
      )
      .addCase(toggleBlockYurt.rejected, (state) => {
        state.toggleBlockLoading = false;
        state.fetchLoading = false;
      });
  },
});

export const yurtsReducer = yurtsSlice.reducer;

export const selectAllYurts = (state: RootState) => state.yurts.allYurts;
export const selectUnblockedYurts = (state: RootState) => state.yurts.unblockedYurts;
export const selectYurtsFetchLoading = (state: RootState) => state.yurts.fetchLoading;
export const selectYurtCreateLoading = (state: RootState) => state.yurts.createLoading;
export const selectYurtToggleBlockLoading = (state: RootState) => state.yurts.toggleBlockLoading;
