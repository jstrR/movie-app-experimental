"use client";
import React from "react";

export const ToggleButton = ({
  onChange,
  value,
  label,
  checked,
}: {
  onChange: () => void;
  value: string;
  label: string;
  checked: boolean;
}) => (
  <div role="button">
    <input
      onChange={onChange}
      type="radio"
      id={value}
      name="tabs"
      className="hidden"
      value={value}
    />
    <label
      htmlFor={value}
      className={`flex cursor-pointer select-none items-center justify-center truncate rounded-full p-4 py-2 text-sm font-medium uppercase transition duration-150 ${
        checked
          ? "bg-main text-white hover:bg-hoverMain dark:bg-mainDark dark:hover:bg-hoverMainDark"
          : "border bg-transparent text-gray-500 hover:text-gray-400  dark:border-mainDark dark:text-gray-400 dark:hover:text-gray-300"
      }`}
    >
      {label}
    </label>
  </div>
);
