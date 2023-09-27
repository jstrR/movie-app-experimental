"use client";
import { useUnit } from "effector-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { $currentUser, logout, setUser } from "~/entities/user/model";
import type { TUser } from "~/entities/user/types";
import { trpc } from "~/providers/trpcClient";

import { ButtonNav, ButtonGeneric } from "~/shared/ui/buttons";

export const AuthBar = ({ user }: { user?: TUser }) => {
  const pathname = usePathname();
  const mounted = useRef(false);

  const [currentUser, logoutFn, setUserFn] = useUnit([
    $currentUser,
    logout,
    setUser,
  ]);

  useEffect(() => {
    // initial render
    if (user && !currentUser && !mounted.current) {
      setUserFn(user);
    }
  }, [setUserFn, user, currentUser]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logoutFn();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  if (!currentUser && user && !mounted.current) {
    return null;
  }

  return (
    <>
      {currentUser ? (
        <>
          <h3 className="mb-4 text-center text-2xl font-bold text-main dark:text-mainDark sm:mb-0">
            {currentUser.name}
          </h3>
          <ButtonGeneric onClick={() => logoutMutation.mutate()}>
            {"Log out".toLocaleUpperCase()}
          </ButtonGeneric>
        </>
      ) : (
        <>
          {pathname !== "/login" && (
            <ButtonNav href="/login">{"Log in".toLocaleUpperCase()}</ButtonNav>
          )}
          {pathname !== "/signup" && (
            <ButtonNav href="/signup">
              {"Sign up".toLocaleUpperCase()}
            </ButtonNav>
          )}
        </>
      )}
    </>
  );
};
