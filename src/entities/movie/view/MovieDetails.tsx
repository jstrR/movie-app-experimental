import Image from "next/image";

import { getImageUrl } from "~/entities/movie/api";

import { RatingStarOn } from "~/shared/ui/icons/RatingStarOn";
import type { TMovieDetails } from "../types";

export const MovieDetails = ({
  title,
  poster_path,
  release_date,
  name,
  overview,
  genres,
  runtime,
  budget,
}: //vote_average,
//vote_count,
TMovieDetails) => {
  const releaseDateFormatted = new Date(release_date);
  const movieGenres =
    genres
      .slice(0, 3)
      .map((genre) => genre.name)
      .join(", ") || "";

  return (
    <div className="flex h-full w-full">
      <div className="h relative flex w-1/3 basis-96">
        <Image
          src={getImageUrl(poster_path) || ""}
          alt={title || "movie title"}
          className="h-48 rounded-lg"
          fill
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-rose-500 dark:text-rose-300">
          {title || name}
        </h1>
        <h3 className="pt-4 font-semibold text-main dark:text-mainDark">
          {movieGenres}
        </h3>
        <p className="text-white">{overview}</p>
        <div>
          <span>Release Date</span>
          <span>{releaseDateFormatted.toLocaleDateString("en")}</span>
        </div>
        <div>
          <span>Runtime</span>
          <span>{runtime}</span>
        </div>
        <div>
          <span>Budget</span>
          <span>{budget}</span>
        </div>
        <RatingStarOn />
      </div>
      {/* <div>
        <div className="sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative h-96 w-full overflow-hidden rounded-lg bg-white sm:h-auto">
          <Link href={`/${id}`}></Link>
        </div>
       
        <p className="text-base font-bold text-rose-500 dark:text-rose-300">
          {title || name}
        </p>
      </div>
      <div>
        {release_date && releaseDateFormatted && (
          <h3 className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {releaseDateFormatted.toLocaleDateString("en")}
          </h3>
        )}
      </div> */}
    </div>
  );
};
{
  /* {movieGenres && (
          <h3 className="mt-4 text-sm font-semibold text-main dark:text-mainDark">
            {movieGenres}
          </h3>
        )} */
}
