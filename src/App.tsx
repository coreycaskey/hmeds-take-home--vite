import { ReactNode, useState } from 'react';
import { Button, Container, Stack } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Fab from '@mui/material/Fab';
import { ClientExperience } from './pages/client-experience';
import { ProviderExperience } from './pages/provider-experience';
import { Persona } from './types';

export const App = () => {
  const [persona, setPersona] = useState<Persona>();

  let content: ReactNode;

  /*
    NOTE: for the hardcode `providerId` and `clientId`, I probably could have taken advantage
    of Redux to store the active user instead of prop drilling it down. I would change that
    on another go-around.
  */
  if (!persona) {
    content = (
      <Stack gap={2} direction="column">
        <Button variant="outlined" onClick={() => setPersona(Persona.Provider)}>
          <Stack gap={1} sx={{ alignItems: 'center' }}>
            <LocalPharmacyIcon fontSize="large" /> Assume Provider Persona
          </Stack>
        </Button>

        <Button variant="outlined" onClick={() => setPersona(Persona.Client)}>
          <Stack gap={1} sx={{ alignItems: 'center' }}>
            <PersonIcon fontSize="large" /> Assume Client Persona
          </Stack>
        </Button>
      </Stack>
    );
  } else if (persona === Persona.Provider) {
    content = (
      <ProviderExperience providerId="c180cf31-6f54-40ed-beb9-1a63dc2a189c" />
    );
  } else if (persona === Persona.Client) {
    content = (
      <ClientExperience clientId="dd0b7af9-7ed9-42ca-8e0b-46f2b97f492b" />
    );
  }

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!!persona && (
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setPersona(undefined)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
          }}
        >
          <Stack direction="row" gap={1}>
            <ArrowBackIcon />
            Change Persona
          </Stack>
        </Fab>
      )}

      {content}
    </Container>
  );
};
