import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Availability, DayJS, Provider } from '~/types';
import { useConfirmAppointmentMutation } from '~/redux/api/api-slice';
import { ReactNode, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { formatIsoDate, formatIsoDateToTime } from '~/utils';

export interface ConfirmAppointmentContentProps {
  clientId: string;
  onClose: () => void;
  onBack: () => void;
  selectedSlot: Availability;
  selectedProvider: Provider;
}

export const ConfirmAppointmentContent: React.FC<
  ConfirmAppointmentContentProps
> = ({ onBack, onClose, selectedSlot, selectedProvider, clientId }) => {
  const [timestamp] = useState<DayJS>(dayjs);

  const [is24HoursBefore, setIs24HoursBefore] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('30 min 00 sec');
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const [confirmAppointment, { isLoading, error, isSuccess }] =
    useConfirmAppointmentMutation();

  useInterval(
    () => {
      if (dayjs(selectedSlot.timeSlot.startTime) < dayjs().add(24, 'hours')) {
        setIs24HoursBefore(false);
      }
    },
    is24HoursBefore ? 1000 : null
  );

  useInterval(
    () => {
      const now = dayjs();
      const timeoutTime = timestamp.add(30, 'minutes');

      const msRemaining = timeoutTime.diff(now);
      const minutesRemaining = timeoutTime.diff(now, 'minutes');
      const secondsRemaining = timeoutTime.diff(now, 'seconds') % 60;

      setTimeRemaining(`${minutesRemaining} min ${secondsRemaining} sec`);

      if (msRemaining <= 0) {
        setHasTimedOut(true);
      }
    },
    !hasTimedOut ? 1000 : null
  );

  let content: ReactNode;

  /*
    NOTE: would definitely come back here and work on some of the invalidation logic for the availabilities
    when the 24 hour validation happens or the 30 minute timeout goes off, to ensure the availabilities
    are fully up to date
  */

  if (isLoading) {
    content = <CircularProgress />;
  } else if (error) {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography align="center">
          Failed to confirm appointment. Please try again.
        </Typography>

        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
      </Stack>
    );
  } else if (!is24HoursBefore) {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography align="center">
          This appointment is no longer 24 hours before. Select another.
        </Typography>

        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
      </Stack>
    );
  } else if (hasTimedOut) {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography sx={{ textAlign: 'center' }}>
          You exceeded the time period for confirming. Please select a time slot
          again.
        </Typography>

        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
      </Stack>
    );
  } else if (isSuccess) {
    content = (
      <Stack gap={2}>
        <Typography align="center">Successfully booked:</Typography>

        <Stack gap={2} sx={{ border: '2px solid #0277bd' }} padding={3}>
          <Typography align="center">
            {formatIsoDate(selectedSlot.date)}{' '}
          </Typography>

          <Typography align="center">
            {formatIsoDateToTime(selectedSlot.timeSlot.startTime)} -{' '}
            {formatIsoDateToTime(selectedSlot.timeSlot.endTime)}
          </Typography>

          <Typography align="center">{selectedProvider.name}</Typography>
        </Stack>

        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Stack>
    );
  } else {
    content = (
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        <Typography align="center">Confirm selection of time slot:</Typography>

        <Stack gap={2} sx={{ border: '2px solid #0277bd' }} padding={3}>
          <Typography align="center">
            {formatIsoDate(selectedSlot.date)}{' '}
          </Typography>

          <Typography align="center">
            {formatIsoDateToTime(selectedSlot.timeSlot.startTime)} -{' '}
            {formatIsoDateToTime(selectedSlot.timeSlot.endTime)}
          </Typography>

          <Typography align="center">{selectedProvider.name}</Typography>
        </Stack>

        <Typography align="center">Time Remaining: {timeRemaining}</Typography>

        <Stack gap={2}>
          <Button
            variant="contained"
            onClick={() =>
              confirmAppointment({
                providerId: selectedProvider.id,
                clientId,
                date: selectedSlot.date,
                timeSlot: selectedSlot.timeSlot,
              })
            }
          >
            Confirm Appointment
          </Button>

          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Box>
    );
  }

  return content;
};
