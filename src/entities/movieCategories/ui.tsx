"use client";
import { useUnit } from "effector-react";

import { selectMovieCategory } from "~/features/movies/movieCategories/model";
import { ToggleButton } from "~/shared/ui/buttons";

import { $movieCategory, MoviesCategories } from "./model";
import { useRouter } from "next/navigation";
import type { TMovieCategory } from "./types";

export const MovieCategories = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const [movieCategory, onSelectMovieCategory] = useUnit([
    $movieCategory,
    selectMovieCategory,
  ]);

  const handleSelectMovieCategory = (type: TMovieCategory) => {
    onSelectMovieCategory(type);
    router.push("/");
  };

  return (
    <section className="mb-8 mt-2 flex w-full flex-row flex-wrap items-center justify-between gap-y-4 sm:mt-4 sm:justify-evenly sm:gap-y-0">
      {MoviesCategories.filter((type) => type.visible).map((type, i) => (
        <ToggleButton
          key={i}
          value={type.value}
          label={type.label}
          onChange={() => handleSelectMovieCategory(type)}
          checked={movieCategory?.value === type.value}
          disabled={disabled}
        />
      ))}
    </section>
  );
};
