"use client";

import { useEffect, useLayoutEffect } from "react";
import { useUnit } from "effector-react";

import { MovieCategories } from "~/features/movies/movieCategories";
import { $moviesList, $moviesGenres, selectMovieCategory, loadMoviesGenres, MoviesCategories } from "~/entities/movie/model";
import { MovieCard } from "~/entities/movie/view";

export default function MoviePage() {
  const [moviesList, genres, onSelectMovieCategory, getMoviesGenres] = useUnit([$moviesList, $moviesGenres, selectMovieCategory, loadMoviesGenres]);

  useLayoutEffect(() => {
    onSelectMovieCategory(MoviesCategories[0]);
  }, [onSelectMovieCategory]);

  useEffect(() => {
    getMoviesGenres();
  }, [getMoviesGenres]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-4 md:w-9/12 lg:w-8/12">
      <MovieCategories />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {moviesList?.results && genres && (
          moviesList.results.map((movie, i) => <MovieCard key={i} {...movie} genresList={genres} />)
        )}
      </section>
    </div>
  )
}