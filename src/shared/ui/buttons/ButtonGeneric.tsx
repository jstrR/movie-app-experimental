import React from "react";

export const ButtonGeneric = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <button onClick={onClick} className="flex-shrink-0 w-full px-8 sm:order-2 sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-mainColor hover:bg-hoverColorBg hover:cursor-pointer text-sm font-medium">
      {children}
    </button>
  );
};
