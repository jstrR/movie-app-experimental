import React from "react";

export const Text = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  return (
    <p className={`text-sm text-mainColor font-medium ${className || ""}`}>
      {children}
    </p>
  );
};
