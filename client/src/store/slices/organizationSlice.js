import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { organizationService } from '../../services/api';

// Get organization
export const getOrganization = createAsyncThunk(
  'organization/getOrganization',
  async (id, { rejectWithValue }) => {
    try {
      const response = await organizationService.getOrganization(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization'
      );
    }
  }
);

// Update organization
export const updateOrganization = createAsyncThunk(
  'organization/updateOrganization',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await organizationService.updateOrganization(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update organization'
      );
    }
  }
);

const initialState = {
  organization: null,
  loading: false,
  error: null,
  success: false,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizationError: (state) => {
      state.error = null;
    },
    resetOrganizationSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get organization
      .addCase(getOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = action.payload;
      })
      .addCase(getOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update organization
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.organization = action.payload;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrganizationError, resetOrganizationSuccess } = organizationSlice.actions;
export default organizationSlice.reducer;