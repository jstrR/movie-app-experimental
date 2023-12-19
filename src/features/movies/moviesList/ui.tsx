"use client";
import { useEffect } from "react";
import { useUnit } from "effector-react";

import { $moviesSearchQuery } from "~/features/movies/movieSearch/model";
import { $movieCategory } from "~/entities/movieCategories/model";

import {
  setMoviesList,
  loadNextMovies,
  loadMovies,
  $moviesList,
} from "~/entities/movie/model";
import { MoviesPalette } from "~/entities/movie/view";

import { Loader } from "~/shared/ui/loader";
import type { TMovieGenre, TMoviesReponse } from "~/entities/movie";

export const MoviesList = ({
  moviesList,
  genres,
  searchValue,
}: {
  moviesList: TMoviesReponse;
  genres: TMovieGenre[];
  searchValue?: string;
}) => {
  const [dynamicMoviesList, setMovies, getMovies, getNextMovies] = useUnit([
    $moviesList,
    setMoviesList,
    loadMovies,
    loadNextMovies,
  ]);

  const [moviesSearchQuery] = useUnit([$moviesSearchQuery]);
  const [movieCategory] = useUnit([$movieCategory]);

  useEffect(() => {
    if (!searchValue && movieCategory) {
      getMovies(movieCategory);
    }
  }, [getMovies, movieCategory, searchValue]);

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
