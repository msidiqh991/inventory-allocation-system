import React, { useState } from "react";
import { ChevronDown } from "@deemlol/next-icons";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue = "",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <select
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-12 text-sm text-gray-700 outline-none transition
        focus:border-brand-400 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100
        dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-brand-600 appearance-none ${className}`}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <ChevronDown 
          className={`transition-transform duration-200 ${isOpen && !disabled ? "rotate-180" : ""}`}
          size={16} 
        />
      </span>
    </div>
  );
};

export default Select;