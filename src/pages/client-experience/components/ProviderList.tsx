import {
  Avatar,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Calendar } from '~/components/Calendar';
import { useGetProvidersQuery } from '~/redux/api/api-slice';
import { DayJS, Provider } from '~/types';
import { isFetchError } from '~/utils';
import { AppointmentModal } from './AppointmentModal';
import { ClientAppointments } from './ClientAppointments';

export interface ProviderListProps {
  clientId: string;
}

export const ProviderList: React.FC<ProviderListProps> = ({ clientId }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const [selectedDate, setSelectedDate] = useState<DayJS>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalButton, setShowModalButton] = useState(false);

  const { data, error, isLoading, isFetching } = useGetProvidersQuery();

  const handleDateChange = (value: DayJS) => {
    setSelectedDate(value);
    setShowModalButton(true);
  };

  if (error) {
    return (
      <Stack gap={2} alignItems="center">
        <Typography variant="h5" align="center">
          Uh oh! We couldn't load your providers.
        </Typography>

        <Stack direction="row" gap={1}>
          <Typography variant="overline">Reason:</Typography>
          <Typography variant="overline" color="#ff4436">
            {isFetchError(error)
              ? (error.data as { message: string }).message
              : error.message}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  if (isLoading || isFetching) {
    return <CircularProgress />;
  }

  /*
    NOTE: With more time, I would've liked to introduce some styling configuration for the
    provider calendar here to indicate whether a specific date has a schedule set, so
    it can be disabled for the client.

    Additionally, having some logic in the API / DB to track whether a Provider has any
    schedule set up at all to disable their button (i.e. newly integrated Providers)
  */
  if (data) {
    return (
      <>
        <Stack gap={3}>
          <Stack gap={3} alignItems="center">
            <Typography variant="subtitle1" align="center">
              Available Providers:
            </Typography>

            <Stack
              direction="row"
              width="315px"
              gap={2}
              sx={{ overflowX: 'scroll' }}
            >
              {data.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outlined"
                  onClick={() => setSelectedProvider(provider)}
                  sx={{ minWidth: '150px' }}
                >
                  <Stack gap={1} alignItems="center">
                    <Avatar
                      src={provider.profile}
                      alt={provider.name}
                      sx={{ width: '32px', height: '32px' }}
                    />

                    <Typography>{provider.name}</Typography>
                  </Stack>
                </Button>
              ))}
            </Stack>

            <Stack>
              {!!selectedProvider && (
                <Typography align="center">
                  Selected Provider: {selectedProvider.name}
                </Typography>
              )}

              <Calendar
                disabled={!selectedProvider}
                onSelect={handleDateChange}
              />
            </Stack>
          </Stack>

          {!!selectedDate && showModalButton && (
            <Button variant="contained" onClick={() => setIsModalOpen(true)}>
              Book Appointment for {selectedDate.format('ddd, MMM D')}
            </Button>
          )}

          {!!selectedProvider && !!selectedDate && (
            <ClientAppointments
              clientId={clientId}
              providerId={selectedProvider.id}
              selectedDate={selectedDate.toISOString()}
            />
          )}
        </Stack>

        {!!selectedProvider && !!selectedDate && isModalOpen && (
          <AppointmentModal
            clientId={clientId}
            onClose={() => setIsModalOpen(false)}
            selectedProvider={selectedProvider}
            selectedDate={selectedDate}
          />
        )}
      </>
    );
  }

  return null;
};
