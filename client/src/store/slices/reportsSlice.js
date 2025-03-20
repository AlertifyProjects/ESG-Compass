import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from '../../services/api';

// Get all reports
export const getAllReports = createAsyncThunk(
  'reports/getAllReports',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await reportService.getAllReports(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch reports'
      );
    }
  }
);

// Get report by ID
export const getReportById = createAsyncThunk(
  'reports/getReportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportService.getReportById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch report'
      );
    }
  }
);

// Create new report
export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportService.createReport(reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create report'
      );
    }
  }
);

// Update report
export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await reportService.updateReport(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update report'
      );
    }
  }
);

// Get report data
export const getReportData = createAsyncThunk(
  'reports/getReportData',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reportService.getReportData(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch report data'
      );
    }
  }
);

const initialState = {
  reports: [],
  report: null,
  reportData: null,
  loading: false,
  error: null,
  success: false,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    resetReportsSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all reports
      .addCase(getAllReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get report by ID
      .addCase(getReportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reports.push(action.payload);
        state.report = action.payload;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update report
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.report = action.payload;
        state.reports = state.reports.map(report =>
          report._id === action.payload._id ? action.payload : report
        );
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get report data
      .addCase(getReportData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(getReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportsError, resetReportsSuccess } = reportsSlice.actions;
export default reportsSlice.reducer;