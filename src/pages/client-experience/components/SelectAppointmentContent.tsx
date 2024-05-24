import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useGetAvailabilityQuery } from '~/redux/api/api-slice';
import { Availability, DayJS, Provider } from '~/types';
import { formatIsoDate, formatIsoDateToTime, isFetchError } from '~/utils';

export interface SelectAppointmentContentProps {
  selectedDate: DayJS;
  selectedProvider: Provider;
  onSlotSelected: (slot: Availability) => void;
  onClose: () => void;
}

export const SelectAppointmentContent: React.FC<
  SelectAppointmentContentProps
> = ({ selectedDate, selectedProvider, onSlotSelected, onClose }) => {
  const { data, error, isLoading, isFetching } = useGetAvailabilityQuery({
    id: selectedProvider.id,
    date: selectedDate.toISOString(),
  });

  if (error) {
    return (
      <>
        <Stack gap={2} alignItems="center">
          <Typography variant="h5" align="center">
            Uh oh! We couldn't load the time slots.
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

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ marginTop: '24px' }}
        >
          Close
        </Button>
      </>
    );
  }

  if (isLoading || isFetching) {
    return <CircularProgress />;
  }

  /*
    I would've liked to dedicate more time to styling this modal but it didn't seem
    as important as some other functionality items
  */
  return (
    <>
      <Typography variant="h6" component="h2" align="center">
        Selected Provider: {selectedProvider.name}
      </Typography>

      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Selected Date: {formatIsoDate(selectedDate.toISOString())}
      </Typography>

      <Box marginTop={3}>
        {data?.length ? (
          <Stack gap={2} alignItems="center">
            <Typography>Please choose a time slot:</Typography>

            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap={1}
              maxHeight="300px"
              sx={{ overflowY: 'scroll' }}
            >
              {data.map((avail) => (
                <Button
                  variant="outlined"
                  onClick={() => onSlotSelected(avail)}
                >
                  {formatIsoDateToTime(avail.timeSlot.startTime)} -{' '}
                  {formatIsoDateToTime(avail.timeSlot.endTime)}
                </Button>
              ))}
            </Box>
          </Stack>
        ) : (
          <Typography>No available appointments for this day.</Typography>
        )}
      </Box>

      <Button variant="contained" onClick={onClose} sx={{ marginTop: '24px' }}>
        Close
      </Button>
    </>
  );
};
