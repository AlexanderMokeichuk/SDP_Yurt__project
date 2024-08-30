import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createService,
  fetchAllServices,
  fetchUnblockedService,
  toggleBlockService,
  updateService,
} from '@services/servicesThunks';
import { RootState } from '~/app/store';
import { IService, IServiceFromDb } from '~/types/service';

interface ServiceState {
  serviceList: IService[];
  unblockedService: IService[];
  serviceListLoading: boolean;
  createLoading: boolean;
}

const initialState: ServiceState = {
  serviceList: [],
  unblockedService: [],
  serviceListLoading: false,
  createLoading: false,
};

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createService.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(
        createService.fulfilled,
        (state, { payload: service }: PayloadAction<IServiceFromDb | null>) => {
          state.createLoading = false;
          if (service) {
            state.serviceList.unshift(service);
          }
        },
      )
      .addCase(createService.rejected, (state) => {
        state.createLoading = false;
      });

    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.serviceListLoading = true;
      })
      .addCase(
        fetchAllServices.fulfilled,
        (state, { payload: services }: PayloadAction<IService[]>) => {
          state.serviceListLoading = false;
          state.serviceList = services;
        },
      )
      .addCase(fetchAllServices.rejected, (state) => {
        state.serviceListLoading = false;
      });

    builder
      .addCase(fetchUnblockedService.pending, (state) => {
        state.serviceListLoading = true;
      })
      .addCase(
        fetchUnblockedService.fulfilled,
        (state, { payload: services }: PayloadAction<IService[]>) => {
          state.serviceListLoading = false;
          state.unblockedService = services;
        },
      )
      .addCase(fetchUnblockedService.rejected, (state) => {
        state.serviceListLoading = false;
      });

    builder
      .addCase(toggleBlockService.pending, (state) => {
        state.serviceListLoading = true;
      })
      .addCase(
        toggleBlockService.fulfilled,
        (state, { payload: service }: PayloadAction<IService | null>) => {
          if (service) {
            state.serviceList = state.serviceList.map((item) => {
              if (item._id === service._id) {
                return service;
              }
              return item;
            });
          }
          state.serviceListLoading = false;
        },
      )
      .addCase(toggleBlockService.rejected, (state) => {
        state.serviceListLoading = false;
      });
    builder
      .addCase(updateService.pending, (state) => {
        state.serviceListLoading = true;
      })
      .addCase(
        updateService.fulfilled,
        (state, { payload: updatedService }: PayloadAction<IServiceFromDb | null>) => {
          state.serviceListLoading = false;
          if (updatedService) {
            state.serviceList = state.serviceList.map((item) =>
              item._id === updatedService._id ? updatedService : item,
            );
          }
        },
      )
      .addCase(updateService.rejected, (state) => {
        state.serviceListLoading = false;
      });
  },
});

export const serviceReducer = servicesSlice.reducer;

export const selectServiceList = (state: RootState) => state.services.serviceList;
export const selectUnblockedService = (state: RootState) => state.services.unblockedService;
export const selectServiceCreateLoading = (state: RootState) => state.services.createLoading;
export const selectServiceListLoading = (state: RootState) => state.services.serviceListLoading;
