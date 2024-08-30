import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDatesRequest, IReportFromDb } from '~/types/report';
import axiosApi from '~/axiosApi';

export const requestReports = createAsyncThunk<IReportFromDb[], IDatesRequest>(
  'reports/requestReports',
  async (dates) => {
    try {
      const { data: response } = await axiosApi.post<IReportFromDb[]>('/reports', dates);
      return response;
    } catch (e) {
      return [];
    }
  },
);
