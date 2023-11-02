import { createEffect, createStore, createEvent, split, sample, combine } from 'effector';

import { getCurrentMovies, getMoviesGenres, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from './api';
import type { TMoviesReponse, TMovieGenre, TMovieCategory, TMovieCategoryNext } from './types';

import { searchMoviesFx } from '~/features/movies/movieSearch/model';

const concatStoreResults = (prevStore: TMoviesReponse, nextStore: TMoviesReponse) => (
  { ...prevStore, results: prevStore.results.concat(nextStore.results), page: nextStore.page }
);

export const MoviesCategories = [
  { value: "current", label: "Now playing", visible: true },
  { value: "upcoming", label: "Upcoming", visible: true },
  { value: "popular", label: "Popular", visible: true },
  { value: "topRated", label: "Top rated", visible: true },
] as const;

export const getCurrentMoviesFx = createEffect((store: TMovieCategoryNext) => getCurrentMovies(store?.page));
export const getUpcomingMoviesFx = createEffect((store: TMovieCategoryNext) => getUpcomingMovies(store?.page));
export const getPopularMoviesFx = createEffect((store: TMovieCategoryNext) => getPopularMovies(store?.page));
export const getTopRatedMoviesFx = createEffect((store: TMovieCategoryNext) => getTopRatedMovies(store?.page));

export const loadMovies = createEvent<TMovieCategory>();
export const loadNextMovies = createEvent<TMovieCategoryNext>();
export const selectMovieCategory = createEvent<TMovieCategory>();

export const $movieCategory = createStore<TMovieCategory | null>(null).on(
  selectMovieCategory, (_, result) => result,
);

export const $moviesList = createStore<TMoviesReponse | null>(null)
  .on(getCurrentMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getPopularMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getTopRatedMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getUpcomingMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(searchMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .reset($movieCategory)

export const $moviesListLoading = combine(
  getCurrentMoviesFx.pending,
  getPopularMoviesFx.pending,
  getTopRatedMoviesFx.pending,
  getUpcomingMoviesFx.pending,
  (
    currentLoading,
    popularLoading,
    topRatedLoading,
    upcomingLoading,
  ) => currentLoading || popularLoading || topRatedLoading || upcomingLoading
);

sample({
  clock: [$movieCategory, loadMovies],
  source: $movieCategory,
  filter: category => !!category,
  fn: category => ({ type: category?.value || MoviesCategories[0].value, page: 1, query: "" }),
  target: loadNextMovies
});

split({
  source: loadNextMovies,
  match: (data: TMovieCategoryNext) => data.type,
  cases: {
    [MoviesCategories[0].value]: getCurrentMoviesFx,
    [MoviesCategories[1].value]: getUpcomingMoviesFx,
    [MoviesCategories[2].value]: getPopularMoviesFx,
    [MoviesCategories[3].value]: getTopRatedMoviesFx,
    'search': searchMoviesFx
  }
});

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
