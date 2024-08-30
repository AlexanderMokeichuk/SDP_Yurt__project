import { IClientFromDb } from '~/types/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { getClients, toggleBlockClient } from '@clients/clientsThunks';

interface ClientsSlice {
  clients: IClientFromDb[];
  clientsLoading: boolean;
}

const initialState: ClientsSlice = {
  clients: [],
  clientsLoading: false,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.clientsLoading = true;
      })
      .addCase(
        getClients.fulfilled,
        (state, { payload: clients }: PayloadAction<IClientFromDb[]>) => {
          state.clients = clients;
          state.clientsLoading = false;
        },
      )
      .addCase(getClients.rejected, (state) => {
        state.clientsLoading = false;
      });

    builder
      .addCase(toggleBlockClient.pending, (state) => {
        state.clientsLoading = true;
      })
      .addCase(
        toggleBlockClient.fulfilled,
        (state, { payload: client }: PayloadAction<IClientFromDb | null>) => {
          if (client) {
            state.clients = state.clients.map((item) => {
              if (item._id === client._id) {
                return client;
              }
              return item;
            });
          }

          state.clientsLoading = false;
        },
      )
      .addCase(toggleBlockClient.rejected, (state) => {
        state.clientsLoading = false;
      });
  },
});

export const clientsReducer = clientsSlice.reducer;

export const selectClients = (state: RootState) => state.clients.clients;
export const selectClientsLoading = (state: RootState) => state.clients.clientsLoading;
