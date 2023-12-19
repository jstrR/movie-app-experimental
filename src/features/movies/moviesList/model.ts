import { createEffect, createEvent, split, combine } from 'effector';

import { $moviesList, concatStoreResults } from '~/entities/movie/model';
import { getCurrentMovies, getUpcomingMovies, getPopularMovies, getTopRatedMovies } from '~/entities/movie/api';

import { MoviesCategories } from '~/entities/movieCategories/model';
import type { TMovieCategoryNext } from '~/entities/movieCategories/types';

export const getCurrentMoviesFx = createEffect((store: TMovieCategoryNext) => getCurrentMovies(store?.page));
export const getUpcomingMoviesFx = createEffect((store: TMovieCategoryNext) => getUpcomingMovies(store?.page));
export const getPopularMoviesFx = createEffect((store: TMovieCategoryNext) => getPopularMovies(store?.page));
export const getTopRatedMoviesFx = createEffect((store: TMovieCategoryNext) => getTopRatedMovies(store?.page));

export const loadNextMovies = createEvent<TMovieCategoryNext>();

$moviesList
  .on(getCurrentMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getPopularMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getTopRatedMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)
  .on(getUpcomingMoviesFx.doneData, (store, data) => store && data.page !== 1 ? concatStoreResults(store, data) : data)

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

split({
  source: loadNextMovies,
  match: (data: TMovieCategoryNext) => data.type,
  cases: {
    [MoviesCategories[0].value]: getCurrentMoviesFx,
    [MoviesCategories[1].value]: getUpcomingMoviesFx,
    [MoviesCategories[2].value]: getPopularMoviesFx,
    [MoviesCategories[3].value]: getTopRatedMoviesFx,
  }
});
