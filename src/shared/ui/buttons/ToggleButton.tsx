"use client";
import React from "react";

export const ToggleButton = ({
  onChange,
  value,
  label,
  checked,
  disabled,
}: {
  onChange: () => void;
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
}) => (
  <div role="button">
    <input
      onChange={onChange}
      type="radio"
      id={value}
      name="tabs"
      className="hidden"
      value={value}
      disabled={disabled}
    />
    <label
      htmlFor={value}
      className={`flex select-none items-center justify-center truncate rounded-full p-4 py-2 text-sm font-medium uppercase transition duration-150 ${
        checked
          ? "bg-main text-white hover:bg-hoverMain dark:bg-mainDark dark:hover:bg-hoverMainDark"
          : "border bg-transparent text-gray-500 hover:text-gray-400  dark:border-mainDark dark:text-gray-400 dark:hover:text-gray-300"
      } ${disabled ? "opacity-50" : "cursor-pointer"}`}
    >
      {label}
    </label>
  </div>
);
