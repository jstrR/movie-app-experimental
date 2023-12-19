import { createEffect, createEvent, createStore, sample, split } from "effector";

import { $movieCategory } from "~/entities/movieCategories/model";
import type { TMovieCategoryNext } from "~/entities/movieCategories/types";

import type { TMoviesReponse } from "~/entities/movie";
import { requestMovies } from "~/entities/movie/api";
import { concatStoreResults } from "~/entities/movie/model";

import { loadNextMovies } from "../moviesList/model";

export const searchMoviesFx = createEffect((store: { query: string; page: number }) => requestMovies(store?.query, store?.page));

export const setMoviesSearchQuery = createEvent<string>();

export const $moviesSearchQuery = createStore<string>("").on(setMoviesSearchQuery, (_, query) => query).reset($movieCategory)

export const $moviesSearchLoading = searchMoviesFx.pending.map(state => state);

export const $moviesList = createStore<TMoviesReponse | null>(null)
  .on(searchMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)

sample({
  clock: $moviesSearchQuery,
  filter: query => !!query,
  fn: query => ({ query, page: 1 }),
  target: searchMoviesFx
});

split({
  source: loadNextMovies,
  match: (data: TMovieCategoryNext) => data.type,
  cases: {
    'search': searchMoviesFx
  }
});
