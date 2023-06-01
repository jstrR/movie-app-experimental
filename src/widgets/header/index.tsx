import Link from "next/link";
import { AuthBar } from "~/features/auth/authBar";

export const Header = () => {
  return (
    <header className="flex flex-col items-center justify-between border-b pb-5 pt-4 sm:flex-row">
      <h2 className="mb-4 flex justify-between text-2xl font-bold text-mainColor sm:mb-0 sm:ml-20">
        <Link href="/">Movie-App</Link>
      </h2>
      <div className="flex flex-col items-center justify-between gap-y-4 sm:mr-20 sm:flex-row sm:gap-x-4 sm:gap-y-0">
        <AuthBar />
      </div>
    </header>
  );
};
