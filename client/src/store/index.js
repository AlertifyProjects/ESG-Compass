import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import metricsReducer from './slices/metricsSlice';
import reportsReducer from './slices/reportsSlice';
import organizationReducer from './slices/organizationSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    metrics: metricsReducer,
    reports: reportsReducer,
    organization: organizationReducer,
    users: usersReducer,
  },
});

export default store;