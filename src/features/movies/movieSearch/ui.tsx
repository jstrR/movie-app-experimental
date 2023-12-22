"use client";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { SearchInput } from "~/shared/ui/searchInput";

import { setMoviesSearchQuery } from "./model";

export const MovieSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(
    searchParams?.get("search") || ""
  );

  const [setSearchQuery] = useUnit([setMoviesSearchQuery]);
  console.log(pathname);
  useEffect(() => {
    if (!searchValue) {
      return;
    }
    const timer = setTimeout(() => router.push(`/?search=${searchValue}`), 600);
    return () => clearTimeout(timer);
  }, [searchValue, router, pathname]);

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    if (!pathname.includes("?search") || pathname === "/") {
      setSearchValue("");
    }
  }, [pathname]);

  const handleSearchValue = (val: string) => {
    setSearchValue(val);
    if (!val) {
      return router.push("/");
    }
  };

  return <SearchInput onChange={handleSearchValue} />;
};
