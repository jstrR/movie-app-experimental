"use client";
import { useUnit } from "effector-react";

import { $movieCategory, selectMovieCategory, MoviesCategories } from "./model";

import { ToggleButton } from "~/shared/ui/buttons";

export const MovieCategories = ({ disabled }: { disabled?: boolean }) => {
  const [movieCategory, onSelectMovieCategory] = useUnit([
    $movieCategory,
    selectMovieCategory,
  ]);

  return (
    <section className="mb-8 mt-2 flex w-full flex-row flex-wrap items-center justify-between gap-y-4 sm:mt-4 sm:justify-evenly sm:gap-y-0">
      {MoviesCategories.filter((type) => type.visible).map((type, i) => (
        <ToggleButton
          key={i}
          value={type.value}
          label={type.label}
          onChange={() => onSelectMovieCategory(type)}
          checked={movieCategory?.value === type.value}
          disabled={disabled}
        />
      ))}
    </section>
  );
};
