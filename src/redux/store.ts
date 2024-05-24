import {
  Action,
  ThunkAction,
  combineSlices,
  configureStore,
} from '@reduxjs/toolkit';

import { apiSlice } from './api/api-slice';

const rootReducer = combineSlices(apiSlice);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
