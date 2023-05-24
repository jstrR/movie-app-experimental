import { createEffect, createStore, createEvent, split, sample, combine } from 'effector';

import { getCurrentMovies, getMoviesGenres, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from './api';
import type { TMovieSectionResponse, TMovieGenre, TMovieCategory } from './types';

export const MoviesCategories = [
  { value: "current", label: "Now playing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "popular", label: "Popular" },
  { value: "topRated", label: "Top rated" },
] as const;

export const getCurrentMoviesFx = createEffect(() => getCurrentMovies());
export const getPopularMoviesFx = createEffect(() => getPopularMovies());
export const getTopRatedMoviesFx = createEffect(() => getTopRatedMovies());
export const getUpcomingMoviesFx = createEffect(() => getUpcomingMovies());

export const selectMovieCategory = createEvent<TMovieCategory>();

export const $movieCategory = createStore<TMovieCategory | null>(null).on(
  selectMovieCategory, (_, result) => result,
);

export const $moviesList = createStore<TMovieSectionResponse | null>(null)
  .on(getCurrentMoviesFx.doneData, (_, result) => result)
  .on(getPopularMoviesFx.doneData, (_, result) => result)
  .on(getTopRatedMoviesFx.doneData, (_, result) => result)
  .on(getUpcomingMoviesFx.doneData, (_, result) => result);

export const $moviesListLoading = combine(
  getCurrentMoviesFx.pending,
  getPopularMoviesFx.pending,
  getTopRatedMoviesFx.pending,
  getUpcomingMoviesFx.pending,
  (
    currentLoading,
    popularLoading,
    topRatedLoading,
    upcomingLoading
  ) => currentLoading || popularLoading || topRatedLoading || upcomingLoading
);

split({
  source: $movieCategory,
  match: (category: TMovieCategory | null) => category?.value,
  cases: {
    [MoviesCategories[0].value]: getCurrentMoviesFx,
    [MoviesCategories[1].value]: getPopularMoviesFx,
    [MoviesCategories[2].value]: getTopRatedMoviesFx,
    [MoviesCategories[3].value]: getUpcomingMoviesFx,
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
