"use client"
import { useUnit } from "effector-react";

import { $movieListType, selectMovieList, MoviesListsTypes, $moviesList } from '~/entities/movie/model';
import { ToggleButton } from '~/shared/ui/buttons';

export const MovieListsFilter = () => {
  const [movies, movieListType, onSelectMovieList] = useUnit([$moviesList, $movieListType, selectMovieList]);

  return (
    <section className="flex mt-4 mb-8 w-full items-center justify-evenly">
      {MoviesListsTypes.map((type, i) => (
        <ToggleButton key={i} value={type.value} label={type.label} onChange={() => onSelectMovieList(type)} checked={movieListType?.value === type.value} />
      ))}
    </section>
  )
}
