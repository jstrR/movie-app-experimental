import React from "react";

export const Text = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-sm font-medium text-main dark:text-mainDark ${
      className || ""
    }`}
  >
    {children}
  </p>
);
