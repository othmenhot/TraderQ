import React, { useState } from 'react';
// import { DateRange } from 'react-day-picker'; // This line is removed as it causes the error
import { Button } from '../ui/Button';
import { Calendar } from '../ui/Calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const presetRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'All Time', value: 'all' },
  { label: 'Custom', value: 'custom' },
];

const DateFilterModal = ({ isOpen, onRequestClose, onApplyFilter }) => {
  const [selectedPreset, setSelectedPreset] = useState('all');
  const [customDateRange, setCustomDateRange] = useState(undefined); // Initialized as undefined

  const handleApply = () => {
    let range;
    const now = new Date();

    switch (selectedPreset) {
      case 'today':
        range = { from: subDays(now, 1), to: now };
        break;
      case 'last_week':
        range = { from: startOfWeek(subDays(now, 7)), to: endOfWeek(subDays(now, 7)) };
        break;
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        range = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
        break;
      case 'custom':
        range = customDateRange;
        break;
      case 'all':
      default:
        range = undefined; // No filter
        break;
    }
    onApplyFilter(range);
    onRequestClose();
  };
  
  const handlePresetChange = (value) => {
    setSelectedPreset(value);
    if (value !== 'custom') {
      setCustomDateRange(undefined);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter History</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a date range" />
            </SelectTrigger>
            <SelectContent>
              {presetRanges.map(preset => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPreset === 'custom' && (
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={customDateRange}
                onSelect={setCustomDateRange}
                numberOfMonths={1}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onRequestClose}>Cancel</Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateFilterModal;
