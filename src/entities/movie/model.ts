import { createEffect, createStore, createEvent, split } from 'effector';

import { getCurrentMovies, getMoviesGenres, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from './api';
import type { TMovieSectionResponse, TMovieGenre, TMovieListType } from './types';

export const MoviesListsTypes = [
  { value: "current", label: "Now playing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "popular", label: "Popular" },
  { value: "topRated", label: "Top rated" },
] as const;

const getCurrentMoviesFx = createEffect(() => getCurrentMovies());
const getPopularMoviesFx = createEffect(() => getPopularMovies());
const getTopRatedMoviesFx = createEffect(() => getTopRatedMovies());
const getUpcomingMoviesFx = createEffect(() => getUpcomingMovies());

const getMoviesGenresFx = createEffect(getMoviesGenres);

export const selectMovieList = createEvent<TMovieListType>();

export const $movieListType = createStore<TMovieListType>(MoviesListsTypes[0]).on(
  selectMovieList, (_, result) => result,
);

export const $moviesList = createStore<TMovieSectionResponse | null>(null)
  .on(getCurrentMoviesFx.doneData, (_, result) => result)
  .on(getPopularMoviesFx.doneData, (_, result) => result)
  .on(getTopRatedMoviesFx.doneData, (_, result) => result)
  .on(getUpcomingMoviesFx.doneData, (_, result) => result);

export const $moviesGenres = createStore<TMovieGenre[] | null>(null).on(
  getMoviesGenresFx.doneData, (_, result) => result,
);

split({
  source: $movieListType,
  match: (listType: TMovieListType) => listType.value,
  cases: {
    [MoviesListsTypes[0].value]: getCurrentMoviesFx,
    [MoviesListsTypes[1].value]: getPopularMoviesFx,
    [MoviesListsTypes[2].value]: getTopRatedMoviesFx,
    [MoviesListsTypes[3].value]: getUpcomingMoviesFx,
  }
})