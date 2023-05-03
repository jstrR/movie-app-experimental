/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent, useMemo } from "react";
import { trpc } from "~/providers/trpcClient";

type TError = { [key: string]: string[] };

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [error, setError] = useState<TError | null>(null);

  const signup = trpc.users.signup.useMutation();

  const signupUser = async () => {
    try {
      setError(null);
      await signup.mutateAsync({ name, email, password, repPassword })
    } catch (e) {
      if (e instanceof TRPCClientError) {
        const errorData = e.data as { zodError: { fieldErrors: { [key: string]: string[] } } };
        if (errorData?.zodError) {
          setError(errorData.zodError.fieldErrors)
        }
      }
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signupUser();
  };

  const startingError = useMemo(() => error && Object.entries(error)?.[0], [error]);

  return (
    <div className="flex flex-col flex-nowrap items-center w-full sm:w-1/2 ">
      <div className="flex grow-[9] flex-col w-full items-center justify-center mt-8 sm:mt-0  ">
        <h2 className="text-2xl text-mainColor font-bold mb-4 sm:mb-0 text-center">
          Sign Up
        </h2>
        <form className="mt-8 mb-3 text-xl text-blue-500 flex flex-col justify-center items-center w-full gap-y-6" onSubmit={onSubmit}>
          <input type="text" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Name" name="userName" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Email" name="userMail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Password" name="userPassword" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Repeat password" name="userRepPassword" value={repPassword} onChange={e => setRepPassword(e.target.value)} required />
          <button className="mt-2 px-10 py-1 text-xl hover:text-rose-400 text-rose-600 flex justify-center items-center border-2 rounded border-rose-600 hover:border-rose-400 w-5/6 sm:w-3/5" type="submit">Sign Up!</button>
        </form>
        {startingError && <p className="mt-3 text-xl text-rose-600 text-center">{startingError[0]}: {startingError[1]?.[0]}</p>}
      </div>
      <div className="flex grow-[1] flex-col justify-end">
        <h2 className="flex text-xl justify-end text-mainColor font-bold mb-4">
          Copyright © Movie-App {new Date().getFullYear()}
        </h2>
      </div>
    </div>
  )
}