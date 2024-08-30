import { IReportFromDb } from '~/types/report';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { requestReports } from '@reports/reportsThunks';

interface ReportsSlice {
  reports: IReportFromDb[] | null;
  reportLoading: boolean;
}

const initialState: ReportsSlice = {
  reports: null,
  reportLoading: false,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestReports.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(
        requestReports.fulfilled,
        (state, { payload: reports }: PayloadAction<IReportFromDb[]>) => {
          state.reports = reports;
          state.reportLoading = false;
        },
      )
      .addCase(requestReports.rejected, (state) => {
        state.reportLoading = false;
      });
  },
});

export const reportsReducer = reportsSlice.reducer;

export const selectReports = (state: RootState) => state.reports.reports;
export const selectReportLoading = (state: RootState) => state.reports.reportLoading;
