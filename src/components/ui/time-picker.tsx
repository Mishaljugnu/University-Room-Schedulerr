
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
  minTime?: string;
  maxTime?: string;
  interval?: number;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className,
  minTime = "08:00",
  maxTime = "20:00",
  interval = 30
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Generate time options from minTime to maxTime
  useEffect(() => {
    const options: string[] = [];
    const [minHour, minMinute] = minTime.split(":").map(Number);
    const [maxHour, maxMinute] = maxTime.split(":").map(Number);
    
    const minMinutes = minHour * 60 + minMinute;
    const maxMinutes = maxHour * 60 + maxMinute;
    
    for (let mins = minMinutes; mins <= maxMinutes; mins += interval) {
      const hour = Math.floor(mins / 60);
      const minute = mins % 60;
      options.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    }
    
    setTimeOptions(options);
  }, [minTime, maxTime, interval]);

  // Scroll to selected time when opened
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const selectedTimeElem = scrollRef.current.querySelector(
        `[data-time="${value}"]`
      );
      if (selectedTimeElem) {
        selectedTimeElem.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }
    }
  }, [isOpen, value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectTime = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    time: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelectTime(time);
    }
  };

  return (
    <div className={cn("relative", className)} ref={timePickerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between font-normal"
      >
        {value || "Select time"}
        <span className="ml-2 opacity-70">{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md border border-border shadow-lg">
          <div className="py-1 h-60 overflow-y-auto scrollable-time-picker" ref={scrollRef}>
            {timeOptions.map((time) => (
              <div
                key={time}
                onClick={() => handleSelectTime(time)}
                onKeyDown={(e) => handleKeyDown(e, time)}
                data-time={time}
                tabIndex={0}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-muted transition-colors",
                  time === value && "bg-umblue text-white hover:bg-umblue-light"
                )}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
