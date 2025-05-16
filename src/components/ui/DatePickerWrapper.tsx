import { DatePicker } from './DatePicker';

interface DatePickerWrapperProps {
  value?: Date;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export function DatePickerWrapper({ value, onChange, disabled }: DatePickerWrapperProps) {
  const handleSelect = (date?: Date) => {
    if (date) {
      onChange(date.toISOString().slice(0, 10));
    } else {
      onChange('');
    }
  };
  return <DatePicker value={value} onSelect={handleSelect} disabled={disabled} />;
}
