import { createEffect, createEvent, createStore, sample } from "effector";

import { requestMovies } from "~/entities/movie/api";

export const searchMoviesFx = createEffect((store: { query: string; page: number }) => requestMovies(store?.query, store?.page));

export const setMoviesSearchQuery = createEvent<string>();

export const $moviesSearchQuery = createStore<string>("").on(setMoviesSearchQuery, (_, query) => query);

export const $moviesSearchLoading = searchMoviesFx.pending.map(state => state);

sample({
  clock: $moviesSearchQuery,
  filter: query => !!query,
  fn: query => ({ query, page: 1 }),
  target: searchMoviesFx
});
