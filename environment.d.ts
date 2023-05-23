declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_MOVIE_API_KEY: string;
      JWT_SECRET: string;
    }
  }
}