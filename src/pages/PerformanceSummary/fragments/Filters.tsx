import { useEffect, useState } from 'react';

import {
  BarChart2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCcwIcon,
  UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { DatePickerWrapper } from '@/components/ui/DatePickerWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Input } from '@/components/ui/Input';

interface FiltersProps {
  filterDate: string;
  filterName: string;
  filterKpiType: string;
  onDateChange: (date: string) => void;
  onNameChange: (name: string) => void;
  onKpiTypeChange: (type: string) => void;
  loading?: boolean;
  onReset?: () => void;
}

export function Filters({
  filterDate,
  filterName,
  filterKpiType,
  onDateChange,
  onNameChange,
  onKpiTypeChange,
  loading = false,
  onReset,
}: FiltersProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nameInput, setNameInput] = useState(filterName);

  useEffect(() => {
    setNameInput(filterName);
  }, [filterName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (nameInput !== filterName) {
        onNameChange(nameInput);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [nameInput, filterName, onNameChange]);

  const isResettable = !!filterDate || !!filterName || !!filterKpiType;

  return (
    <Card className="mb-4 p-0">
      <CardContent className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold ml-2">Filter</span>
          {isResettable && (
            <Button
              className="h-4 px-2 py-3 text-xs cursor-pointer"
              onClick={onReset}
              disabled={loading}
            >
              <RotateCcwIcon className="size-3" />
              Reset Filter
            </Button>
          )}
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-2">
          <div className="flex-1">
            <DatePickerWrapper
              value={filterDate ? new Date(filterDate) : undefined}
              onChange={onDateChange}
              disabled={loading}
            />
          </div>
          <div className="flex-2">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <UserIcon className="size-4" />
              </span>
              <Input
                type="text"
                placeholder="Client Name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={loading}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative w-full h-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <BarChart2Icon className="size-4" />
              </span>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`border px-2 py-1 h-full rounded-md w-full text-left pl-9 pr-8 ${loading ? 'pointer-events-none opacity-60' : ''}`}
                    aria-disabled={loading}
                  >
                    {filterKpiType === ''
                      ? 'All'
                      : filterKpiType === 'ctr'
                        ? 'CTR'
                        : filterKpiType === 'impression'
                          ? 'Impression'
                          : filterKpiType}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      {dropdownOpen ? (
                        <ChevronUpIcon className="size-4" />
                      ) : (
                        <ChevronDownIcon className="size-4" />
                      )}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup value={filterKpiType} onValueChange={onKpiTypeChange}>
                    <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ctr">CTR</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="impression">Impression</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
