"use client";

import { useEffect } from "react";
import { useUnit } from "effector-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { MovieCategories } from "~/features/movies/movieCategories";
import {
  $moviesList,
  $moviesGenres,
  selectMovieCategory,
  loadMoviesGenres,
  MoviesCategories,
  $moviesGenresLoading,
  loadNextMovies,
} from "~/entities/movie/model";
import { MovieCard } from "~/entities/movie/view";
import { Loader } from "~/shared/ui/loader";

export default function MoviePage() {
  const [moviesList, genres, onSelectMovieCategory, getMoviesGenres, getNextMovies] = useUnit([
    $moviesList, $moviesGenres, selectMovieCategory, loadMoviesGenres, loadNextMovies
  ]);
  const [moviesGenresLoading] = useUnit([$moviesGenresLoading]);

  useEffect(() => {
    onSelectMovieCategory(MoviesCategories[0]);
  }, [onSelectMovieCategory]);

  useEffect(() => {
    if (!genres) {
      getMoviesGenres();
    }
  }, [genres, getMoviesGenres]);

  const loadingContent = moviesGenresLoading || !moviesList || !genres;

  return (
    <div className="container mx-auto flex flex-col items-center p-4 w-3/4 sm:w-5/6 lg:w-2/3">
      <MovieCategories />
      {loadingContent ? (
        <section className="flex justify-center items-center h-full">
          <Loader wrapperClasses="mb-16" classes="w-16 h-16" />
        </section>
      ) : (
        <InfiniteScroll
          dataLength={moviesList.results.length}
          next={() => getNextMovies({ page: moviesList.page + 1, category: moviesList.type })}
          hasMore={moviesList.results.length <= moviesList.total_results}
          loader={<Loader wrapperClasses="flex justify-center my-16" classes="w-16 h-16" />}
        >
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 h-full">
            {moviesList.results.map((movie, i) => <MovieCard key={i} {...movie} genresList={genres} />)}
          </section>
        </InfiniteScroll>
      )}
    </div>
  )
}