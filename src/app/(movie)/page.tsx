"use client";
import { useEffect } from "react";
import { useUnit } from "effector-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { MovieCategories } from "~/features/movies/movieCategories/ui";
import { $moviesSearchQuery } from "~/features/movies/movieSearch/model";
import {
  $movieCategory,
  MoviesCategories,
  selectMovieCategory,
} from "~/features/movies/movieCategories/model";

import {
  $moviesList,
  $moviesGenres,
  loadMoviesGenres,
  $moviesGenresLoading,
  loadNextMovies,
  loadMovies,
} from "~/entities/movie/model";
import { MovieCard } from "~/entities/movie/view";

import { Loader } from "~/shared/ui/loader";

export default function MoviePage() {
  const [moviesList, getMovies, getNextMovies] = useUnit([
    $moviesList,
    loadMovies,
    loadNextMovies,
  ]);
  const [genres, moviesGenresLoading, getMoviesGenres] = useUnit([
    $moviesGenres,
    $moviesGenresLoading,
    loadMoviesGenres,
  ]);
  const [moviesSearchQuery] = useUnit([$moviesSearchQuery]);
  const [movieCategory, onSelectMovieCategory] = useUnit([
    $movieCategory,
    selectMovieCategory,
  ]);

  useEffect(() => {
    onSelectMovieCategory(MoviesCategories[0]);
  }, [onSelectMovieCategory]);

  useEffect(() => {
    if (!moviesSearchQuery && movieCategory) {
      getMovies(movieCategory);
    }
  }, [getMovies, movieCategory, moviesSearchQuery]);

  useEffect(() => {
    if (!genres) {
      getMoviesGenres();
    }
  }, [genres, getMoviesGenres]);

  const loadingContent = moviesGenresLoading || !moviesList || !genres;

  return (
    <div className="container mx-auto flex w-3/4 flex-col items-center pt-0 sm:w-5/6 sm:p-4 lg:w-2/3">
      <MovieCategories disabled={!!moviesSearchQuery} />
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
              type: moviesSearchQuery
                ? "search"
                : movieCategory?.value || "current",
              query: moviesSearchQuery || "",
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
