import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  value?: Date;
  onSelect?: (date?: Date) => void;
  disabled?: boolean;
}

export function DatePicker(props: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(props.value);

  useEffect(() => {
    setSelectedDate(props.value);
  }, [props.value]);

  const handleSelect = (date?: Date) => {
    if (!date) {
      setSelectedDate(undefined);
      if (props.onSelect) props.onSelect(undefined);
      return;
    }
    const fixedDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
    setSelectedDate(fixedDate);
    if (props.onSelect) props.onSelect(fixedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )}
          disabled={props.disabled}
        >
          <CalendarIcon />
          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
