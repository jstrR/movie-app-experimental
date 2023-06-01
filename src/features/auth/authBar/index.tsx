"use client";
import { useUnit } from "effector-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { $currentUser, logout, getSession } from "~/entities/user/model";
import { trpc } from "~/providers/trpcClient";

import { ButtonNav, ButtonGeneric } from "~/shared/ui/buttons";

export const AuthBar = () => {
  const pathname = usePathname();
  const mounted = useRef(false);

  const [currentUser, logoutFn, getSessionFn] = useUnit([
    $currentUser,
    logout,
    getSession,
  ]);

  const retreivedSession = trpc.session.session.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !mounted.current,
    cacheTime: 0,
    onSuccess: (data) => {
      getSessionFn(data);
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        logoutFn();
      }
    },
  });

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

  if (retreivedSession.isLoading) {
    return null;
  }

  return (
    <>
      {currentUser ? (
        <>
          <h3 className="mb-4 text-center text-2xl font-bold text-mainColor sm:mb-0">
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
