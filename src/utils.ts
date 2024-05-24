import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import dayjs from 'dayjs';

import { DayJS } from './types';

export const isFetchError = (
  error: FetchBaseQueryError | SerializedError
): error is FetchBaseQueryError => {
  return !!(error as FetchBaseQueryError).data;
};

export const formatIsoDate = (isoDate: string) => formatDayJs(dayjs(isoDate));

export const formatDayJs = (date: DayJS) => date.format('MM/DD/YYYY');

export const formatIsoDateToTime = (isoDate: string) =>
  dayjs(isoDate).format('h:mm A');
