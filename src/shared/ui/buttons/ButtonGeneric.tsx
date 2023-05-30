import React from "react";

export const ButtonGeneric = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-mainColor px-4 px-8 py-2 text-sm font-medium text-white shadow-sm hover:cursor-pointer hover:bg-hoverColorBg sm:order-2 sm:w-auto"
    >
      {children}
    </button>
  );
};
