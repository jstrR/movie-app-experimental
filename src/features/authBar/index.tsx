"use client"
import { useUnit } from 'effector-react';
import { usePathname } from 'next/navigation';

import { $currentUser, logout } from '~/entities/user/model';

import { ButtonNav, ButtonGeneric } from "~/shared/ui/buttons";

export const AuthBar = () => {
  const pathname = usePathname();

  const [currentUser, logoutFn] = useUnit([$currentUser, logout]);
  return (
    <>
      {currentUser ? (
        <>
          <h3 className="text-2xl text-mainColor font-bold mb-4 sm:mb-0 text-center">
            {currentUser.name}
          </h3>
          <ButtonGeneric onClick={logoutFn}>
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
