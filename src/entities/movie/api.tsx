import { env } from "~/env.mjs";
import {
  type TMoviesReponse,
  type TMovieGenresResponse,
  type TMovieGenre,
} from "./types";

type TMovieDataResp = {
  [key: string]: unknown;
  errors?: { message: string }[];
};

const makeRequest = (
  url: string,
  params?: string,
  body?: BodyInit,
  method = "GET"
) =>
  fetch(
    `${env.NEXT_PUBLIC_API_URL}/${url}?api_key=${
      env.NEXT_PUBLIC_MOVIE_API_KEY
    }${params ? `&${params}` : ""}`,
    {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Accept: "application/json",
      },
      ...(body && { body }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data: TMovieDataResp | TMovieGenresResponse) => {
      if ("errors" in data) {
        throw new Error(data.errors?.[0]?.message || "Invalid request error");
      }
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });

export const getCurrentMovies = async (page = 1): Promise<TMoviesReponse> => {
  const resp = (await makeRequest(
    "movie/now_playing",
    `page=${page}`
  )) as TMoviesReponse;
  return { ...resp };
};

export const getPopularMovies = async (page = 1): Promise<TMoviesReponse> => {
  const resp = (await makeRequest(
    "movie/popular",
    `page=${page}`
  )) as TMoviesReponse;
  return { ...resp };
};

export const getTopRatedMovies = async (page = 1): Promise<TMoviesReponse> => {
  const resp = (await makeRequest(
    "movie/top_rated",
    `page=${page}`
  )) as TMoviesReponse;
  return { ...resp };
};

export const getUpcomingMovies = async (page = 1): Promise<TMoviesReponse> => {
  const resp = (await makeRequest(
    "movie/upcoming",
    `page=${page}`
  )) as TMoviesReponse;
  return { ...resp };
};

export const getMoviesGenres = async (): Promise<TMovieGenre[]> => {
  const resp = (await makeRequest("/genre/movie/list")) as TMovieGenresResponse;
  return resp.genres;
};

export const requestMovies = async (
  query = "",
  page = 1
): Promise<TMoviesReponse> => {
  const resp = (await makeRequest(
    "search/collection",
    query ? `query=${query}&page=${page}` : undefined
  )) as TMoviesReponse;
  return resp;
};

export const getImageUrl = (path = "", width = "w500") =>
  `https://image.tmdb.org/t/p/${width}${path}`;
