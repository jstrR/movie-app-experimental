"use client"
import { useUnit } from "effector-react";

import { $movieCategory, selectMovieCategory, MoviesCategories } from '~/entities/movie/model';
import { ToggleButton } from '~/shared/ui/buttons';

export const MovieCategories = () => {
  const [movieCategory, onSelectMovieCategory] = useUnit([$movieCategory, selectMovieCategory]);

  return (
    <section className="flex flex-row flex-wrap gap-y-4 sm:gap-y-0 mt-2 mb-8 sm:mt-4 w-full items-center justify-between sm:justify-evenly">
      {MoviesCategories.map((type, i) => (
        <ToggleButton
          key={i}
          value={type.value}
          label={type.label}
          onChange={() => onSelectMovieCategory(type)}
          checked={movieCategory?.value === type.value}
        />
      ))}
    </section>
  )
};
