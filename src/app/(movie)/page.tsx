"use client";

import { useEffect } from "react";
import { useUnit } from "effector-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { MovieCategories } from "~/features/movies/movieCategories";
import {
  $moviesList,
  $moviesGenres,
  selectMovieCategory,
  $movieCategory,
  loadMoviesGenres,
  MoviesCategories,
  $moviesGenresLoading,
  loadNextMovies,
  $movieSearchQuery,
  loadMovies,
} from "~/entities/movie/model";
import { MovieCard } from "~/entities/movie/view";
import { Loader } from "~/shared/ui/loader";

export default function MoviePage() {
  const [
    moviesList,
    moviesListQuery,
    genres,
    movieCategory,
    getMovies,
    onSelectMovieCategory,
    getMoviesGenres,
    getNextMovies,
  ] = useUnit([
    $moviesList,
    $movieSearchQuery,
    $moviesGenres,
    $movieCategory,
    loadMovies,
    selectMovieCategory,
    loadMoviesGenres,
    loadNextMovies,
  ]);
  const [moviesGenresLoading] = useUnit([$moviesGenresLoading]);

  useEffect(() => {
    if (!moviesListQuery) {
      onSelectMovieCategory(MoviesCategories[0]);
      getMovies(MoviesCategories[0]);
    }
  }, [getMovies, moviesListQuery, onSelectMovieCategory]);

  useEffect(() => {
    if (!genres) {
      getMoviesGenres();
    }
  }, [genres, getMoviesGenres]);

  const loadingContent = moviesGenresLoading || !moviesList || !genres;

  return (
    <div className="container mx-auto flex w-3/4 flex-col items-center p-4 pt-0 sm:w-5/6 lg:w-2/3">
      <MovieCategories disabled={!!moviesListQuery} />
      {loadingContent ? (
        <section className="flex h-full items-center justify-center">
          <Loader wrapperClasses="mb-16" classes="w-16 h-16" />
        </section>
      ) : (
        <InfiniteScroll
          dataLength={moviesList.results.length}
          next={() =>
            getNextMovies({
              page: moviesList.page + 1,
              type: moviesListQuery
                ? "search"
                : movieCategory?.value || "current",
              query: moviesListQuery || "",
            })
          }
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
      )}
    </div>
  );
}
