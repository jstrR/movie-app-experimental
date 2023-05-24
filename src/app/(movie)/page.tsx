"use client";

import { useEffect } from "react";
import { useUnit } from "effector-react";

import { MovieCategories } from "~/features/movies/movieCategories";
import {
  $moviesList,
  $moviesGenres,
  selectMovieCategory,
  loadMoviesGenres,
  MoviesCategories,
  $moviesGenresLoading,
  $moviesListLoading
} from "~/entities/movie/model";
import { MovieCard } from "~/entities/movie/view";
import { Loader } from "~/shared/ui/loader";

export default function MoviePage() {
  const [moviesList, genres, onSelectMovieCategory, getMoviesGenres] = useUnit([
    $moviesList, $moviesGenres, selectMovieCategory, loadMoviesGenres
  ]);
  const [moviesListLoading, moviesGenresLoading] = useUnit([$moviesListLoading, $moviesGenresLoading]);

  useEffect(() => {
    onSelectMovieCategory(MoviesCategories[0]);
  }, [onSelectMovieCategory]);

  useEffect(() => {
    getMoviesGenres();
  }, [getMoviesGenres]);

  const loadingContent = moviesListLoading || moviesGenresLoading || !moviesList || !genres;

  return (
    <div className="container mx-auto flex flex-col items-center p-4 w-3/4 sm:w-5/6 lg:w-2/3">
      <MovieCategories />
      {loadingContent ? (
        <section className="flex justify-center items-center h-full">
          <Loader size={16} marginBottom />
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 h-full">
          {moviesList.results.map((movie, i) => <MovieCard key={i} {...movie} genresList={genres} />)}
        </section>
      )}
    </div>
  )
}