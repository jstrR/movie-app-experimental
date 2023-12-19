import { createEvent, createStore } from "effector";

import type { TMovieCategory } from "./types";

export const MoviesCategories = [
  { value: "current", label: "Now playing", visible: true },
  { value: "upcoming", label: "Upcoming", visible: true },
  { value: "popular", label: "Popular", visible: true },
  { value: "topRated", label: "Top rated", visible: true },
] as const;

export const selectMovieCategory = createEvent<TMovieCategory>();

export const $movieCategory = createStore<TMovieCategory>(
  MoviesCategories[0]
).on(selectMovieCategory, (_, result) => result);
