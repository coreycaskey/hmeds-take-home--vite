import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useGetProviderQuery } from '~/redux/api/api-slice';
import { isFetchError } from '~/utils';
import { ProviderCalendar } from './components/ProviderCalendar';

export interface ProviderExperienceProps {
  providerId: string;
}

export const ProviderExperience: React.FC<ProviderExperienceProps> = ({
  providerId,
}) => {
  const { data, error, isLoading } = useGetProviderQuery(providerId);

  if (error) {
    return (
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
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    const { name, profile } = data;

    return (
      <Stack gap={3} alignItems="center">
        <Stack gap={2} alignItems="center">
          <Avatar
            src={profile}
            alt={name}
            sx={{ height: '56px', width: '56px' }}
          />

          <Typography variant="h3" align="center">
            Welcome, {name}!
          </Typography>
        </Stack>

        <Typography variant="subtitle1" align="center">
          Please select a date to provide your availability or to view scheduled
          appointments
        </Typography>

        <ProviderCalendar providerId={providerId} />
      </Stack>
    );
  }

  return null;
};
