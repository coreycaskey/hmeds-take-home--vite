import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { useGetClientAppointmentsQuery } from '~/redux/api/api-slice';
import { formatIsoDateToTime, isFetchError } from '~/utils';

export interface ClientAppointmentsProps {
  clientId: string;
  providerId: string;
  selectedDate: string;
}

export const ClientAppointments: React.FC<ClientAppointmentsProps> = ({
  clientId,
  providerId,
  selectedDate,
}) => {
  const { data, isLoading, isFetching, error } = useGetClientAppointmentsQuery({
    clientId,
    providerId,
    date: selectedDate,
  });

  let content: ReactNode;

  if (error) {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography variant="h5" align="center">
          Uh oh! We couldn't load your appointments.
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
  } else if (isLoading || isFetching) {
    content = <CircularProgress />;
  } else if (data?.length) {
    content = (
      <Stack gap={1} width="100%">
        <Typography align="center">Your Appointments:</Typography>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {data.map((appointment) => (
            <ListItem key={appointment.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={appointment.provider.name}
                  src={appointment.provider.profile}
                />
              </ListItemAvatar>

              <ListItemText
                primary={`Provider: ${appointment.provider.name}`}
                secondary={
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {formatIsoDateToTime(appointment.timeSlot.startTime)} -{' '}
                    {formatIsoDateToTime(appointment.timeSlot.endTime)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    );
  } else {
    content = (
      <Typography align="center">
        You currently have no appointments! We'll let you know when that
        changes.
      </Typography>
    );
  }

  return (
    <Box display="flex" justifyContent="center" marginBottom={3}>
      {content}
    </Box>
  );
};
