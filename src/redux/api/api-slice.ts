import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Appointment,
  AppointmentRequest,
  Availability,
  Client,
  Provider,
  TimeSlot,
} from '~/types';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  reducerPath: 'booking',
  tagTypes: ['Booking'],
  endpoints: (build) => ({
    getProviders: build.query<Provider[], void>({
      query: () => `/providers`,
      providesTags: () => [{ type: 'Booking', id: 'providers' }],
    }),
    getProvider: build.query<Provider, string>({
      query: (id) => `/providers/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Booking', id: `provider-${id}` },
      ],
    }),
    getClient: build.query<Client, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Booking', id: `client-${id}` },
      ],
    }),
    getAvailability: build.query<Availability[], { id: string; date: string }>({
      query: ({ id, date }) => `/providers/${id}/availability?date=${date}`,
      providesTags: (result, error, { id, date }) => [
        { type: 'Booking', id: `availability-${id}-${date}` },
      ],
    }),
    getHours: build.query<TimeSlot, { id: string; date: string }>({
      query: ({ id, date }) => `/providers/${id}/hours?date=${date}`,
      providesTags: (result, error, { id, date }) => [
        { type: 'Booking', id: `hours-${id}-${date}` },
      ],
    }),
    updateHours: build.mutation<
      Provider,
      { id: string; date: string; timeSlot: TimeSlot }
    >({
      query: ({ id, timeSlot, date }) => ({
        url: `/providers/${id}/hours`,
        method: 'PUT',
        body: { date, timeSlot },
      }),
      invalidatesTags: (result, error, { id, date }) => [
        { type: 'Booking', id: `hours-${id}-${date}` },
      ],
    }),
    getProviderAppointments: build.query<
      Appointment[],
      { id: string; date: string }
    >({
      query: ({ id, date }) => `/providers/${id}/appointments?date=${date}`,
      providesTags: (result, error, { id, date }) => [
        { type: 'Booking', id: `provider-appointments-${id}-${date}` },
      ],
    }),
    getClientAppointments: build.query<
      Appointment[],
      { clientId: string; date: string; providerId: string }
    >({
      query: ({ clientId, date, providerId }) =>
        `/clients/${clientId}/appointments?date=${date}&providerId=${providerId}`,
      providesTags: (result, error, { clientId, date, providerId }) => [
        {
          type: 'Booking',
          id: `client-appointments-${clientId}-${date}-${providerId}`,
        },
      ],
    }),
    confirmAppointment: build.mutation<Appointment, AppointmentRequest>({
      query: (body) => ({
        url: `/providers/${body.providerId}/appointments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { providerId, date, clientId }) => [
        { type: 'Booking', id: `provider-appointments-${providerId}-${date}` },
        { type: 'Booking', id: `availability-${providerId}-${date}` },
        {
          type: 'Booking',
          id: `client-appointments-${clientId}-${date}-${providerId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetProvidersQuery,
  useGetProviderQuery,
  useGetClientQuery,
  useGetAvailabilityQuery,
  useGetHoursQuery,
  useUpdateHoursMutation,
  useGetProviderAppointmentsQuery,
  useConfirmAppointmentMutation,
  useGetClientAppointmentsQuery,
} = apiSlice;
