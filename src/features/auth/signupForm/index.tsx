"use client"
import { useRouter } from 'next/navigation';
import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent, useMemo } from "react";
import { useUnit } from "effector-react";

import { trpc } from "~/providers/trpcClient";
import { signup } from '~/entities/user/model';

type TError = { [key: string]: string[] };

export const SignupForm = () => {
  const router = useRouter();
  const signupFn = useUnit(signup);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [error, setError] = useState<TError | null>(null);

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      signupFn(data)
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
    signupMutation.mutate({ name, email, password, repPassword });
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupUser();
  };

  const startingError = useMemo(() => error && Object.entries(error)?.[0], [error]);

  return (
    <>
      <form className="mt-8 mb-3 text-xl text-blue-500 flex flex-col justify-center items-center w-full gap-y-6" onSubmit={onSubmit}>
        <input type="text" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Name" name="userName" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Email" name="userMail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Password" name="userPassword" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Repeat password" name="userRepPassword" value={repPassword} onChange={e => setRepPassword(e.target.value)} required />
        <button className="mt-2 px-10 py-1 text-xl hover:text-rose-400 text-rose-600 flex justify-center items-center border-2 rounded border-rose-600 hover:border-rose-400 w-5/6 sm:w-3/5" type="submit">Sign Up!</button>
      </form>
      {startingError && <p className="mt-3 text-xl text-rose-600 text-center">{startingError[0]}: {startingError[1]?.[0]}</p>}
    </>
  )
}
