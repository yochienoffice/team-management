"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./TimePickerInput";

type DateTimePickerProps = {
  time: Date;
  onChange: (time: string) => void;
  disabled?: boolean;
};

export function DateTimePicker({ time, onChange, disabled }: DateTimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (newDay: Date | undefined) => {
    const res = `${newDay?.getHours().toString().padStart(2, "0")}:${newDay?.getMinutes().toString().padStart(2, "0")}`;
    if (!newDay) return;
    if (!time) {
      onChange(res);
      return;
    }
    onChange(res);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-40 justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? format(time, "HH:mm") : <span>Select Time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-3 border-t border-border">
          <div className="flex items-end gap-2">
            <div className="grid gap-1 text-center">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <TimePickerInput
                picker="hours"
                date={time}
                setDate={handleSelect}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
              />
            </div>
            <div className="grid gap-1 text-center">
              <Label htmlFor="minutes" className="text-xs">
                Minutes
              </Label>
              <TimePickerInput
                picker="minutes"
                date={time}
                setDate={handleSelect}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
              />
            </div>
            <div className="flex h-10 items-center">
              <Clock className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
