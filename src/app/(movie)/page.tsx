import {
  getCurrentMovies,
  getMoviesGenres,
  requestMovies,
} from "~/entities/movie/api";
import { MovieCategories } from "~/entities/movieCategories/ui";
import { MoviesList } from "~/features/movies/moviesList/ui";

export default async function MoviePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { search } = searchParams;

  const [moviesList, genres] = await Promise.all([
    search ? requestMovies(search) : getCurrentMovies(),
    getMoviesGenres(),
  ]);

  return (
    <div className="sm:w-5/6 lg:w-2/3 container mx-auto flex w-3/4 flex-col items-center pt-0 sm:p-4">
      <MovieCategories />
      <MoviesList
        moviesList={moviesList}
        genres={genres}
        searchValue={search}
      />
    </div>
  );
}
