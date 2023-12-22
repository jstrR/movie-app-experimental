import { getMovieDetails, getMoviesGenres } from "~/entities/movie/api";
import { MovieDetails } from "~/entities/movie/view";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [movieDetails] = await Promise.all([
    getMovieDetails(id),
    getMoviesGenres(),
  ]);

  return (
    <div className="sm:w-5/6 lg:w-2/3 container mx-auto flex w-3/4 flex-col items-center pt-0 sm:p-4">
      <MovieDetails {...movieDetails} />
    </div>
  );
}
