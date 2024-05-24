import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { Calendar } from '~/components/Calendar';
import { DayJS } from '~/types';
import { ProviderAvailability } from './ProviderAvailability';

export interface ProviderCalendarProps {
  providerId: string;
}

export const ProviderCalendar: React.FC<ProviderCalendarProps> = ({
  providerId,
}) => {
  const [selectedDate, setSelectedDate] = useState<DayJS>();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar onSelect={setSelectedDate} />

      {!!selectedDate && (
        <ProviderAvailability
          providerId={providerId}
          selectedDate={selectedDate}
        />
      )}
    </LocalizationProvider>
  );
};
