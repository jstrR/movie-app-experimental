import { createEffect, createStore, createEvent, sample } from 'effector';

import { getMoviesGenres } from './api';
import type { TMoviesReponse, TMovieGenre } from './types';

import { $movieCategory, MoviesCategories } from '~/entities/movieCategories/model';

export const concatStoreResults = (prevStore: TMoviesReponse, nextStore: TMoviesReponse) => (
  { ...prevStore, results: prevStore.results.concat(nextStore.results), page: nextStore.page }
);

export const setMoviesList = createEvent<TMoviesReponse>();

export const $moviesList = createStore<TMoviesReponse | null>(null)
  .on(setMoviesList, (_, data) => data)

export const getMoviesGenresFx = createEffect(getMoviesGenres);

export const loadMoviesGenres = createEvent();

export const $moviesGenres = createStore<TMovieGenre[] | null>(null).on(
  getMoviesGenresFx.doneData, (_, result) => result,
);

export const $moviesGenresLoading = getMoviesGenresFx.pending;

sample({
  clock: loadMoviesGenres,
  target: getMoviesGenresFx
});
export { $movieCategory, MoviesCategories };

