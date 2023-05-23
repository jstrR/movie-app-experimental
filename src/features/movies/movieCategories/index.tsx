"use client"
import { useUnit } from "effector-react";

import { $movieCategory, selectMovieCategory, MoviesCategories } from '~/entities/movie/model';
import { ToggleButton } from '~/shared/ui/buttons';

export const MovieCategories = () => {
  const [movieCategory, onSelectMovieCategory] = useUnit([$movieCategory, selectMovieCategory]);

  return (
    <section className="flex mt-4 mb-8 w-full items-center justify-evenly">
      {MoviesCategories.map((type, i) => (
        <ToggleButton key={i} value={type.value} label={type.label} onChange={() => onSelectMovieCategory(type)} checked={movieCategory?.value === type.value} />
      ))}
    </section>
  )
};
