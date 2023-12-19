"use client";
import InfiniteScroll from "react-infinite-scroll-component";

import { MovieCard } from "~/entities/movie/view";

import { Loader } from "~/shared/ui/loader";
import type { TMovieGenre, TMoviesReponse } from "../types";

export const MoviesPalette = ({
  moviesList,
  genres,
  onNext,
}: {
  moviesList: TMoviesReponse;
  genres: TMovieGenre[];
  onNext: () => void;
}) => {
  return (
    <InfiniteScroll
      dataLength={moviesList.results.length}
      next={onNext}
      hasMore={moviesList.page < moviesList.total_pages}
      loader={
        <Loader
          wrapperClasses="flex justify-center my-16"
          classes="w-16 h-16"
        />
      }
    >
      <section className="grid h-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {moviesList.results.map((movie, i) => (
          <MovieCard key={i} {...movie} genresList={genres} />
        ))}
      </section>
    </InfiniteScroll>
  );
};
