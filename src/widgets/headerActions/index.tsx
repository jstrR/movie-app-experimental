import type { TUser } from "~/entities/user/types";
import { AuthBar } from "~/features/auth/authBar";
import { MovieSearch } from "~/features/movies/movieSearch";

export const HeaderActions = (props: { user?: TUser }) => {
  return (
    <div className="flex w-full flex-[8] flex-col items-center justify-between gap-y-4 sm:mr-20 sm:w-auto sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <MovieSearch />
      <AuthBar {...props} />
    </div>
  );
};
