import "server-only";

import { MovieListsFilter } from "~/features/movies/movieListsFilter";
import { getCurrentMovies, getMoviesGenres } from "~/entities/movie/api";
import { MovieCard } from "~/entities/movie/view";

export default async function MoviePage() {
  const [movies, genres] = await Promise.all([getCurrentMovies(), getMoviesGenres()]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-4 md:w-9/12 lg:w-8/12">
      <MovieListsFilter />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {movies.results?.map((movie, i) => <MovieCard key={i} {...movie} genresList={genres} />)}
      </section>
    </div>
  )
}