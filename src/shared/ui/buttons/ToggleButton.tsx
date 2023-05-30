"use client"
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
    <input onChange={onChange} type="radio" id={value} name="tabs" className="hidden" value={value} />
    <label htmlFor={value} className={`transition duration-150 cursor-pointer flex items-center justify-center truncate uppercase select-none text-sm font-medium rounded-full p-4 py-2 ${checked ? "text-white bg-mainColor hover:bg-hoverColorBg" : "text-gray-500 bg-transparent border hover:text-gray-400"}`}>
      {label}
    </label>
  </div>
);
