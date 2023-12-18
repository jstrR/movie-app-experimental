import Link from "next/link";

import type { TUser } from "~/entities/user/types";
import { HeaderActions } from "../headerActions";

export const Header = (props: { user?: TUser }) => {
  return (
    <header className="flex flex-col items-center justify-between border-b border-mainBg pb-5 pt-4 dark:border-mainBgDark sm:flex-row">
      <h2 className="mb-4 flex flex-[2] justify-between text-2xl font-bold text-main dark:text-mainDark sm:mb-0 sm:ml-20">
        <Link href="/">Movie-App</Link>
      </h2>
      <HeaderActions user={props.user} />
    </header>
  );
};
