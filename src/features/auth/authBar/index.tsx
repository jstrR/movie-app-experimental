"use client"
import { useUnit } from 'effector-react';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { $currentUser, logout, getSession } from '~/entities/user/model';
import { trpc } from '~/providers/trpcClient';

import { ButtonNav, ButtonGeneric } from "~/shared/ui/buttons";

export const AuthBar = () => {
  const pathname = usePathname();
  const mounted = useRef(false);

  const [currentUser, logoutFn, getSessionFn] = useUnit([$currentUser, logout, getSession]);

  const retreivedSession = trpc.auth.session.useQuery(undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !currentUser && !mounted.current,
      cacheTime: 0
    });

  useLayoutEffect(() => {
    if (!currentUser && retreivedSession.data) {
      getSessionFn(retreivedSession.data);
    }
  }, [currentUser, getSessionFn, retreivedSession.data]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      retreivedSession.remove();
      logoutFn();
    },
    onError: e => {
      console.log(e);
    }
  });

  return (
    <>
      {currentUser ? (
        <>
          <h3 className="text-2xl text-mainColor font-bold mb-4 sm:mb-0 text-center">
            {currentUser.name}
          </h3>
          <ButtonGeneric onClick={() => logoutMutation.mutate()}>
            {"Log out".toLocaleUpperCase()}
          </ButtonGeneric>
        </>
      ) : (
        <>
          {pathname !== '/login' && (
            <ButtonNav href="/login">
              {"Log in".toLocaleUpperCase()}
            </ButtonNav>
          )}
          {pathname !== '/signup' && (
            <ButtonNav href="/signup">
              {"Sign up".toLocaleUpperCase()}
            </ButtonNav>
          )}
        </>
      )}
    </>
  );
};
