import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerSelectionState } from '@mui/x-date-pickers/internals';
import { DayJS } from '~/types';

export interface CalendarProps {
  onSelect: (value: DayJS) => void;
  disabled?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        disabled={disabled}
        disableFuture={disabled}
        disablePast
        onChange={onSelect}
      />
    </LocalizationProvider>
  );
};
