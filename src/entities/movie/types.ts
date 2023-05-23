export type TMovieType = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TMovieGenre = {
  id: number;
  name: string;
};

export type TMovieImage = {
  aspect_ration: number;
  file_path: string;
  height: number;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type TMovieVideos = {
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

export type TMovieImages = {
  id: number;
  backdrops: TMovieImage[];
  posters: TMovieImage[];
};

export type TMovieCast = {
  adult: boolean;
  gender: number;
  name: string;
  id: number;
  profile_path: string;
  known_department: string;
  cast_id: number;
  popularity: number;
  character: string;
  order: string;
};

export type TMovieCredits = {
  id: number;
  cast: TMovieCast[];
  crew: TMovieCast[];
};

export type TMovieDetails = {
  details: TMovieType;
  images: TMovieImages;
  videos: TMovieVideos;
  credits: TMovieCredits;
};

export type TMoviesReponse = {
  page: number;
  results: TMovieType[];
  total_results: number;
  total_pages: number;
};

export type TMovieGenresResponse = {
  genres: TMovieGenre[];
};

export type TMovieListType = {
  value: 'popular' | 'upcoming' | 'current' | 'topRated';
  label: string;
};

export type TMovieSectionResponse = TMoviesReponse & {
  type: string;
};
