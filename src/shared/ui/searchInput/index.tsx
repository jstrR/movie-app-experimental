"use client";
import React, { useEffect, useState } from "react";

export const SearchInput = ({
  onChange,
}: {
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  useEffect(() => {
    if (!value) {
      setOpen(false);
    }
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        type="search"
        id="search-dropdown"
        className={`z-20 block rounded-lg border-gray-300 bg-gray-50 px-2 text-sm text-gray-500 outline-none duration-300 ease-in-out focus:border-gray-300  dark:border-gray-600 dark:border-l-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 ${
          open ? "w-full min-w-[288px] border-2 py-2" : "w-0 border-0 py-2.5"
        }`}
        placeholder="Search ..."
        value={value}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full rounded-lg bg-main px-3 py-2 text-sm font-medium text-white hover:bg-hoverMain focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setOpen(!open)}
      >
        <svg
          className="h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </div>
  );
};
