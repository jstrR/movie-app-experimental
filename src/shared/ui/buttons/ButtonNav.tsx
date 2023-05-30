import React from "react";
import Link from "next/link";

export const ButtonNav = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} {...props}>
      <div className="flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-mainColor px-4 px-8 py-2 text-sm font-bold font-medium text-white shadow-sm hover:cursor-pointer hover:bg-hoverColorBg sm:order-2 sm:w-auto">
        {children}
      </div>
    </Link>
  );
};
