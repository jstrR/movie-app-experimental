import { createEvent, sample } from "effector";

import { loadNextMovies } from "~/features/movies/moviesList/model";

import { $movieCategory, MoviesCategories } from "~/entities/movieCategories/model";
import type { TMovieCategory } from "~/entities/movieCategories/types";

export const selectMovieCategory = createEvent<TMovieCategory>();

$movieCategory.on(selectMovieCategory, (_, result) => result);

sample({
  clock: selectMovieCategory,
  source: $movieCategory,
  filter: (category) => !!category,
  fn: (category) => ({
    type: category?.value || MoviesCategories[0].value,
    page: 1,
    query: "",
  }),
  target: loadNextMovies,
});
