"use client"
import { useRouter } from 'next/navigation';
import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent, useMemo } from "react";
import { useUnit } from "effector-react";

import { trpc } from "~/providers/trpcClient";
import { login } from '~/entities/user/model';

type TError = { [key: string]: string[] };

export const LoginForm = () => {
  const router = useRouter();
  const loginFn = useUnit(login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<TError | null>(null);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      loginFn(data)
      router.replace('/');
    },
    onError: e => {
      if (e instanceof TRPCClientError) {
        const errorData = e.data as { zodError: { fieldErrors: { [key: string]: string[] } } };
        if (errorData?.zodError) {
          setError(errorData.zodError.fieldErrors)
        } else {
          setError({ 'Server error': [e.message] })
        }
      }
    }
  });

  const signupUser = () => {
    setError(null);
    loginMutation.mutate({ email, password });
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupUser();
  };

  const startingError = useMemo(() => error && Object.entries(error)?.[0], [error]);

  return (
    <>
      <form className="mt-8 mb-3 text-xl text-blue-500 flex flex-col justify-center items-center w-full gap-y-6" onSubmit={onSubmit}>
        <input type="email" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Email" aria-label="Email" name="userMail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Password" aria-label="Password" name="userPassword" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={!email || !password} aria-disabled={!email || !password} className="mt-2 px-10 py-1 text-xl disabled:text-rose-300 hover:text-rose-400 text-rose-600 flex justify-center items-center border-2 rounded border-rose-600 disabled:border-rose-300 hover:border-rose-400 w-5/6 sm:w-3/5" type="submit">Log In!</button>
      </form>
      {startingError && <p className="mt-3 text-xl text-rose-600 text-center">{startingError[0]}: {startingError[1]?.[0]}</p>}
    </>
  )
}
