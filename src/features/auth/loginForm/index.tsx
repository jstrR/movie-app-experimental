"use client"
import { useRouter } from 'next/navigation';
import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent, useMemo } from "react";
import { useUnit } from "effector-react";
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';

import { trpc } from "~/providers/trpcClient";
import { login } from '~/entities/user/model';
import { ButtonGoogle } from '~/shared/ui/buttons';
import { Text } from '~/shared/ui/text';

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

  const googleLoginMutation = trpc.auth.loginGoogle.useMutation({
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

  const loginUser = () => {
    setError(null);
    loginMutation.mutate({ email, password });
  }

  const googleLoginUser = (credentialsResponse: TokenResponse) => {
    setError(null);
    googleLoginMutation.mutate({
      accessToken: credentialsResponse.access_token || "",
      expiresIn: credentialsResponse.expires_in || 0
    });
  };

  const googleLoginFn = useGoogleLogin({
    onSuccess: googleLoginUser,
  });


  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  const startingError = useMemo(() => error && Object.entries(error)?.[0], [error]);

  return (
    <div className="mt-8 mb-3 text-xl text-blue-500 flex flex-col justify-center items-center w-full" >
      <form className="flex flex-col gap-y-6 items-center w-full" onSubmit={onSubmit}>
        <input type="email" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Email" aria-label="Email" name="userMail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="border-2 rounded py-1 px-2 placeholder:text-base placeholder:italic placeholder:text-slate-400 w-5/6 sm:w-3/5" placeholder="Password" aria-label="Password" name="userPassword" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={!email || !password} aria-disabled={!email || !password} className="mt-2 px-10 py-1 text-xl disabled:text-rose-300 hover:text-rose-400 text-rose-600 flex justify-center items-center border-2 rounded border-rose-600 disabled:border-rose-300 hover:border-rose-400 w-5/6 sm:w-3/5" type="submit">Login!</button>
      </form>
      <div className="flex flex-col items-center gap-y-6 w-5/6 sm:w-3/5 pt-6">
        <Text className="text-xl">OR</Text>
        <ButtonGoogle onClick={googleLoginFn} className="w-full">
          <Text className="text-white text-xl w-full">Login with Google</Text>
        </ButtonGoogle>
      </div>
      {startingError && <p className="mt-3 text-xl text-rose-600 text-center">{startingError[0]}: {startingError[1]?.[0]}</p>}
    </div >
  )
}
