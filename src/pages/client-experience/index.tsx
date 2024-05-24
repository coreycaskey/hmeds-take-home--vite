import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import { useGetClientQuery, useGetProvidersQuery } from '~/redux/api/api-slice';
import { isFetchError } from '~/utils';
import { ProviderList } from './components/ProviderList';

export interface ClientExperienceProps {
  clientId: string;
}

export const ClientExperience: React.FC<ClientExperienceProps> = ({
  clientId,
}) => {
  const {
    data: client,
    error: clientError,
    isLoading: isLoadingClientInfo,
  } = useGetClientQuery(clientId);

  if (clientError) {
    return (
      <Stack gap={2} alignItems="center">
        <Typography variant="h5" align="center">
          Uh oh! We couldn't load your information.
        </Typography>

        <Stack direction="row" gap={1}>
          <Typography variant="overline">Reason:</Typography>
          <Typography variant="overline" color="#ff4436">
            {isFetchError(clientError)
              ? (clientError.data as { message: string }).message
              : clientError.message}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  if (isLoadingClientInfo) {
    return <CircularProgress />;
  }

  if (client) {
    const { profile, name } = client;

    // NOTE: there is some overlap with this specific section of code (and even the entire component)
    // with the Provider version that could potentially be generalized in a future update

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
          Please select a provider and a date to schedule an appointment.
        </Typography>

        <ProviderList clientId={clientId} />
      </Stack>
    );
  }

  return null;
};
