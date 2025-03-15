import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimePickerDemoProps {
  value?: string;
  onChange: (time: string) => void;
}

export function TimePickerDemo({ value = "", onChange }: TimePickerDemoProps) {
  const [hour, setHour] = React.useState(() => {
    return value ? value.split(":")[0] : "";
  });

  const [minute, setMinute] = React.useState(() => {
    return value ? value.split(":")[1] : "";
  });

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || (Number(newValue) >= 0 && Number(newValue) <= 23)) {
      setHour(newValue);
      if (newValue && minute) {
        const paddedHour = newValue.padStart(2, "0");
        const paddedMinute = minute.padStart(2, "0");
        onChange(`${paddedHour}:${paddedMinute}`);
      }
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || (Number(newValue) >= 0 && Number(newValue) <= 59)) {
      setMinute(newValue);
      if (hour && newValue) {
        const paddedHour = hour.padStart(2, "0");
        const paddedMinute = newValue.padStart(2, "0");
        onChange(`${paddedHour}:${paddedMinute}`);
      }
    }
  };

  const handleClear = () => {
    setHour("");
    setMinute("");
    onChange("");
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid gap-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Time</Label>
            {(hour || minute) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="HH"
              className="w-24 h-8 text-center"
              value={hour}
              onChange={handleHourChange}
              min={0}
              max={23}
            />
            <span className="mx-1">:</span>
            <Input
              type="number"
              placeholder="MM"
              className="w-24 h-8 text-center"
              value={minute}
              onChange={handleMinuteChange}
              min={0}
              max={59}
            />
          </div>
          <div className="grid grid-cols-4 gap-1 mt-1">
            {["00", "06", "12", "18"].map((h) => (
              <Button
                key={`hour-${h}`}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  setHour(h);
                  if (minute) {
                    const paddedMinute = minute.padStart(2, "0");
                    onChange(`${h}:${paddedMinute}`);
                  } else {
                    setMinute("00");
                    onChange(`${h}:00`);
                  }
                }}
              >
                {h}:00
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
