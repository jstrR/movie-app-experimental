import "server-only";
import Image from 'next/image';

import { getCurrentMovies, getImageUrl, getMoviesGenres } from "~/entities/movie/api";
import { type TMovieType, type TMovieGenre } from "~/entities/movie";

type TMovieCard = TMovieType & {
  genresList: TMovieGenre[]
};

export default async function MoviePage() {
  const [movies, genres] = await Promise.all([getCurrentMovies(), getMoviesGenres()]);

  console.log('setestet', genres)
  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-4 md:w-9/12 lg:w-8/12">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {movies.results?.map((movie, i) => <MovieCard key={i} {...movie} genresList={genres} />)}
      </section>
    </div>
  )
}

const MovieCard = ({
  title,
  genre_ids,
  poster_path,
  release_date,
  genresList,
}: TMovieCard) => {
  const releaseDateFormatted = new Date(release_date);
  const movieGenres = genresList?.filter(genre => genre_ids?.includes(genre.id)).slice(0, 3).map(genre => genre.name).join(', ') || "";
  return (
    <div className="relative h-full flex flex-col justify-between">
      <div>
        <div className="relative w-full bg-white rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 ">
          <Image src={getImageUrl(poster_path) || ""} alt={title} className="h-120 w-full object-center object-cover hover:opacity-75 hover:cursor-pointer" width={260} height={480} />
        </div>
        {movieGenres && (
          <h3 className="mt-6 text-sm text-gray-500">
            {movieGenres}
          </h3>
        )}
        <p className="text-base font-semibold text-gray-900">{title}</p>
      </div>
      <div>
        {releaseDateFormatted && (
          <h3 className="mt-2 text-sm text-gray-500">
            {releaseDateFormatted.toLocaleDateString('en')}
          </h3>
        )}
        <button className="mt-2 w-full px-8 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainColor hover:bg-hoverColorBg hover:cursor-pointer font-bold">View</button>
      </div>
    </div>
  );
};