import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { metricService, metricDataService } from '../../services/api';

// Get all metrics
export const getAllMetrics = createAsyncThunk(
  'metrics/getAllMetrics',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await metricService.getAllMetrics(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch metrics'
      );
    }
  }
);

// Get metric by ID
export const getMetricById = createAsyncThunk(
  'metrics/getMetricById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await metricService.getMetricById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch metric'
      );
    }
  }
);

// Create metric data
export const createMetricData = createAsyncThunk(
  'metrics/createMetricData',
  async (metricData, { rejectWithValue }) => {
    try {
      const response = await metricDataService.createMetricData(metricData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create metric data'
      );
    }
  }
);

// Get metric data
export const getMetricData = createAsyncThunk(
  'metrics/getMetricData',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await metricDataService.getAllMetricData(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch metric data'
      );
    }
  }
);

const initialState = {
  metrics: [],
  metric: null,
  metricData: [],
  loading: false,
  error: null,
  success: false,
};

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    clearMetricsError: (state) => {
      state.error = null;
    },
    resetMetricsSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all metrics
      .addCase(getAllMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(getAllMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get metric by ID
      .addCase(getMetricById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMetricById.fulfilled, (state, action) => {
        state.loading = false;
        state.metric = action.payload;
      })
      .addCase(getMetricById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create metric data
      .addCase(createMetricData.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMetricData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.metricData.push(action.payload);
      })
      .addCase(createMetricData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get metric data
      .addCase(getMetricData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMetricData.fulfilled, (state, action) => {
        state.loading = false;
        state.metricData = action.payload;
      })
      .addCase(getMetricData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMetricsError, resetMetricsSuccess } = metricsSlice.actions;
export default metricsSlice.reducer;