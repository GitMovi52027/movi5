import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  disabled,
}: DatePickerProps) {
  // En una versión real, aquí usaríamos un componente de calendario
  // Por ahora, usamos un input tipo date simple
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onChange(newDate);
  };

  const formattedValue = value ? format(value, "yyyy-MM-dd") : "";

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="date"
          value={formattedValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
} 