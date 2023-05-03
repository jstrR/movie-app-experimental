import React from "react";
import Link from 'next/link'

export const ButtonNav = ({ href, children, ...props }: { href: string; children: React.ReactNode; }) => {
  return (
    <Link href={href}  {...props}>
      <div className="flex-shrink-0 w-full px-8 sm:order-2 sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainColor hover:bg-hoverColorBg hover:cursor-pointer font-bold">
        {children}
      </div>
    </Link>
  );
};
