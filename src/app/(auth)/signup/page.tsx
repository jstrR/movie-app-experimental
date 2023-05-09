"use client"
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from "react";
import { useUnit } from "effector-react";

import { $currentUser } from '~/entities/user/model';
import { SignupForm } from '~/features/signupForm';

export default function SignupPage() {
  const router = useRouter();
  const currentUser = useUnit($currentUser);

  useLayoutEffect(() => {
    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser, router])

  return (
    <div className="flex flex-col flex-nowrap items-center w-full sm:w-1/2 ">
      <div className="flex grow-[9] flex-col w-full items-center justify-center mt-8 sm:mt-0  ">
        <SignupForm />
      </div>
      <div className="flex grow-[1] flex-col justify-end">
        <h2 className="flex text-xl justify-end text-mainColor font-bold mb-4">
          Copyright © Movie-App {new Date().getFullYear()}
        </h2>
      </div>
    </div>
  )
}
