export type TMovieCategory = {
  value: 'popular' | 'upcoming' | 'current' | 'topRated';
  label: string;
};

export type TMovieCategoryNext = {
  page: number;
  type: TMovieCategory["value"] | 'search';
  query: string;
}
