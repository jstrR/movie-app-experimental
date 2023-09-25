import Link from "next/link";
import { AuthBar } from "~/features/auth/authBar";

export const Header = () => {
  return (
    <header className="flex flex-col items-center justify-between border-b border-mainBg pb-5 pt-4 dark:border-mainBgDark sm:flex-row">
      <h2 className="mb-4 flex justify-between text-2xl font-bold text-main dark:text-mainDark sm:mb-0 sm:ml-20">
        <Link href="/">Movie-App</Link>
      </h2>
      <div className="flex w-3/5 flex-col items-center justify-between gap-y-4 sm:mr-20 sm:w-auto sm:flex-row sm:gap-x-4 sm:gap-y-0">
        <AuthBar />
      </div>
    </header>
  );
};
