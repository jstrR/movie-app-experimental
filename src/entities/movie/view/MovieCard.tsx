import Image from "next/image";

import { getImageUrl } from "~/entities/movie/api";
import { type TMovieType, type TMovieGenre } from "~/entities/movie";

type TMovieCard = TMovieType & {
  genresList: TMovieGenre[];
};

export const MovieCard = ({
  title,
  genre_ids,
  poster_path,
  release_date,
  genresList,
}: TMovieCard) => {
  const releaseDateFormatted = new Date(release_date);
  const movieGenres =
    genresList
      .filter((genre) => genre_ids?.includes(genre.id))
      .slice(0, 3)
      .map((genre) => genre.name)
      .join(", ") || "";

  return (
    <div className="relative flex h-full flex-col justify-between">
      <div>
        <div className="sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative h-96 w-full overflow-hidden rounded-lg bg-white sm:h-auto">
          <Image
            src={getImageUrl(poster_path) || ""}
            alt={title}
            className="w-full object-fill object-center"
            width={230}
            height={400}
          />
        </div>
        {movieGenres && (
          <h3 className="mt-4 text-sm text-gray-500">{movieGenres}</h3>
        )}
        <p className="text-base font-semibold text-gray-900 dark:text-mainDark">
          {title}
        </p>
      </div>
      <div>
        {releaseDateFormatted && (
          <h3 className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {releaseDateFormatted.toLocaleDateString("en")}
          </h3>
        )}
        <button
          disabled
          className="mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-main px-4 px-8 py-2 text-sm font-bold font-medium text-white shadow-sm hover:bg-hoverMain enabled:hover:cursor-pointer disabled:bg-gray-200 dark:bg-mainDark dark:hover:bg-hoverMainDark dark:disabled:bg-disabledDark"
        >
          View
        </button>
      </div>
    </div>
  );
};
