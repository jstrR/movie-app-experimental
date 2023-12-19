"use client";
import { useEffect } from "react";
import { useUnit } from "effector-react";

import { $moviesSearchQuery } from "~/features/movies/movieSearch/model";
import { $movieCategory } from "~/entities/movieCategories/model";

import { setMoviesList, $moviesList } from "~/entities/movie/model";
import { MoviesPalette } from "~/entities/movie/view";
import type { TMovieGenre, TMoviesReponse } from "~/entities/movie";

import { Loader } from "~/shared/ui/loader";

import { loadNextMovies } from "./model";

export const MoviesList = ({
  moviesList,
  genres,
}: {
  moviesList: TMoviesReponse;
  genres: TMovieGenre[];
}) => {
  const [dynamicMoviesList, setMovies, getNextMovies] = useUnit([
    $moviesList,
    setMoviesList,
    loadNextMovies,
  ]);

  const [moviesSearchQuery] = useUnit([$moviesSearchQuery]);
  const [movieCategory] = useUnit([$movieCategory]);

  useEffect(() => {
    setMovies(moviesList);
  }, [moviesList, setMovies]);

  return (
    <>
      {!moviesList && !dynamicMoviesList ? (
        <section className="flex h-full items-center justify-center">
          <Loader wrapperClasses="mb-16" classes="w-16 h-16" />
        </section>
      ) : (
        <MoviesPalette
          genres={genres}
          moviesList={dynamicMoviesList || moviesList}
          onNext={() =>
            getNextMovies({
              page: (dynamicMoviesList || moviesList).page + 1,
              type: moviesSearchQuery
                ? "search"
                : movieCategory?.value || "current",
              query: moviesSearchQuery || "",
            })
          }
        />
      )}
    </>
  );
};
