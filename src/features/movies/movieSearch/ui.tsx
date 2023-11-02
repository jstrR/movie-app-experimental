"use client";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SearchInput } from "~/shared/ui/searchInput";

import { setMoviesSearchQuery } from "./model";

export const MovieSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");

  const [setSearchQuery] = useUnit([setMoviesSearchQuery]);

  useEffect(() => {
    if (!searchValue) {
      return router.push("/");
    }

    const timer = setTimeout(() => router.push(`/?search=${searchValue}`), 600);
    return () => clearTimeout(timer);
  }, [searchValue, router]);

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams, setSearchQuery]);

  return <SearchInput onChange={setSearchValue} />;
};
