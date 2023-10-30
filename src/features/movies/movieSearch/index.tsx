"use client";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";

import { searchMovies } from "~/entities/movie/model";
import { SearchInput } from "~/shared/ui/searchInput";

export const MovieSearch = () => {
  const [debouncedValue, setDebouncedValue] = useState("");

  const [loadMovies] = useUnit([searchMovies]);

  const handleChange = (query: string) => {
    setDebouncedValue(query);
  };

  useEffect(() => {
    if (!debouncedValue) {
      loadMovies("");
    }
    const timer = setTimeout(() => loadMovies(debouncedValue), 600);
    return () => clearTimeout(timer);
  }, [debouncedValue, loadMovies]);

  return <SearchInput onChange={handleChange} />;
};
