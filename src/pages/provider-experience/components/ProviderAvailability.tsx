import { Stack, Button, Typography, Box, Divider } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { ReactNode, useState } from 'react';
import {
  useGetHoursQuery,
  useUpdateHoursMutation,
} from '~/redux/api/api-slice';
import { DayJS, WorkHours } from '~/types';
import { formatIsoDateToTime, isFetchError } from '~/utils';
import { ProviderAppointments } from './ProviderAppointments';

export interface ProviderAvailabilityProps {
  providerId: string;
  selectedDate: DayJS;
}

export const ProviderAvailability: React.FC<ProviderAvailabilityProps> = ({
  providerId,
  selectedDate,
}) => {
  const { data, error, isLoading, isFetching } = useGetHoursQuery({
    id: providerId,
    date: selectedDate.toISOString(),
  });

  const [updateHours] = useUpdateHoursMutation();

  const [timeRange, setTimeRange] = useState<WorkHours>();

  const hasValidTimeInputs = Boolean(
    timeRange?.startTime &&
      timeRange.endTime &&
      dayjs(timeRange.startTime) < dayjs(timeRange.endTime)
  );

  let content: ReactNode;

  if (error) {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography variant="h5" align="center">
          Uh oh! We couldn't load your information.
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
  } else if (!data) {
    content = (
      <Stack gap={2} alignItems="center">
        <Stack direction="row" gap={2} alignItems="center">
          <Stack gap={1} alignItems="center">
            <Typography paragraph margin={0}>
              Start Time
            </Typography>

            <TimePicker
              minutesStep={15}
              onChange={(value) => {
                // ensures the time has the date from the calendar -- it defaults to today, otherwise
                const newValue = dayjs()
                  .set('month', selectedDate.get('month'))
                  .set('date', selectedDate.get('date'))
                  .set('year', selectedDate.get('year'))
                  .set('hour', value?.get('hour') || 0)
                  .set('minute', value?.get('minute') || 0);

                setTimeRange((prevTimeRange) => ({
                  startTime: newValue.toISOString(),
                  endTime: prevTimeRange?.endTime,
                }));
              }}
            />
          </Stack>

          <Stack gap={1} alignItems="center">
            <Typography paragraph margin={0}>
              End Time
            </Typography>

            <TimePicker
              minutesStep={15}
              onChange={(value) => {
                // ensures the time has the date from the calendar -- it defaults to today, otherwise

                const newValue = dayjs()
                  .set('month', selectedDate.get('month'))
                  .set('date', selectedDate.get('date'))
                  .set('year', selectedDate.get('year'))
                  .set('hour', value?.get('hour') || 0)
                  .set('minute', value?.get('minute') || 0);

                setTimeRange((prevTimeRange) => ({
                  startTime: prevTimeRange?.startTime,
                  endTime: newValue.toISOString(),
                }));
              }}
            />
          </Stack>
        </Stack>

        <Button
          variant="contained"
          disabled={!hasValidTimeInputs}
          onClick={() =>
            updateHours({
              id: providerId,
              date: selectedDate.toISOString(),
              timeSlot: {
                startTime: timeRange!.startTime!,
                endTime: timeRange!.endTime!,
              },
            })
          }
        >
          Confirm Schedule for {selectedDate.format('ddd, MMM D')}
        </Button>
      </Stack>
    );
  } else {
    content = (
      <Stack gap={2} alignItems="center">
        <Typography>
          Your schedule for {selectedDate.format('ddd, MMM D')} is already set!
        </Typography>

        <Stack direction="row" gap={5} alignItems="center">
          <Stack gap={1} alignItems="center">
            <Typography margin={0}>Start Time</Typography>

            <Typography height="56px">
              {formatIsoDateToTime(data.startTime)}
            </Typography>
          </Stack>

          <Stack gap={1} alignItems="center">
            <Typography paragraph margin={0}>
              End Time
            </Typography>

            <Typography height="56px">
              {formatIsoDateToTime(data.endTime)}
            </Typography>
          </Stack>
        </Stack>

        <ProviderAppointments
          providerId={providerId}
          selectedDate={selectedDate.toISOString()}
        />
      </Stack>
    );
  }

  return <Box height="150px">{content}</Box>;
};
