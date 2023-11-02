"use client";
import { useUnit } from "effector-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SearchInput } from "~/shared/ui/searchInput";

import { $moviesSearchQuery, setMoviesSearchQuery } from "./model";

export const MovieSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [moviesSearchQuery, setSearchQuery] = useUnit([
    $moviesSearchQuery,
    setMoviesSearchQuery,
  ]);

  useEffect(() => {
    if (!moviesSearchQuery) {
      return router.push("/");
    }

    const timer = setTimeout(
      () => router.push(`/?search=${moviesSearchQuery}`),
      600
    );
    return () => clearTimeout(timer);
  }, [moviesSearchQuery, router]);

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams, setSearchQuery]);

  return <SearchInput onChange={setSearchQuery} />;
};
