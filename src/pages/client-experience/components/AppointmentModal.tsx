import { Modal, Box } from '@mui/material';
import { useState } from 'react';
import { Availability, DayJS, Provider } from '~/types';
import { ConfirmAppointmentContent } from './ConfirmAppointmentContent';
import { SelectAppointmentContent } from './SelectAppointmentContent';

export interface AppointmentModalProps {
  clientId: string;
  onClose: () => void;
  selectedProvider: Provider;
  selectedDate: DayJS;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 325,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  clientId,
  onClose,
  selectedDate,
  selectedProvider,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<Availability>();
  const [modalType, setModalType] = useState<'select' | 'confirm'>('select');

  return (
    <Modal open onClose={onClose}>
      <Box sx={style}>
        {modalType === 'select' && (
          <SelectAppointmentContent
            selectedDate={selectedDate}
            selectedProvider={selectedProvider}
            onSlotSelected={(slot) => {
              setSelectedSlot(slot);
              setModalType('confirm');
            }}
            onClose={onClose}
          />
        )}

        {modalType === 'confirm' && !!selectedSlot && (
          <ConfirmAppointmentContent
            clientId={clientId}
            onBack={() => {
              setModalType('select');
              setSelectedSlot(undefined);
            }}
            onClose={onClose}
            selectedSlot={selectedSlot}
            selectedProvider={selectedProvider}
          />
        )}
      </Box>
    </Modal>
  );
};
