import React from "react";
import Link from "next/link";

export const ButtonNav = ({
  href,
  type,
  children,
  ...props
}: {
  href: string;
  type?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-main text-sm font-bold font-medium text-white shadow-sm hover:cursor-pointer hover:bg-hoverMain dark:bg-mainDark  dark:hover:bg-hoverMainDark sm:order-2 sm:w-auto">
      <Link
        href={href}
        className="w-full px-4 px-8 py-2 text-center"
        type={type}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
};
