"use client";
import { useRouter } from "next/navigation";
import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent, useMemo } from "react";
import { useUnit } from "effector-react";

import { trpc } from "~/providers/trpcClient";
import { signup } from "~/entities/user/model";

type TError = { [key: string]: string[] };

export const SignupForm = () => {
  const router = useRouter();
  const signupFn = useUnit(signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [error, setError] = useState<TError | null>(null);

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      signupFn(data);
      router.replace("/");
    },
    onError: (e) => {
      if (e instanceof TRPCClientError) {
        const errorData = e.data as {
          zodError: { fieldErrors: { [key: string]: string[] } };
        };
        if (errorData?.zodError) {
          setError(errorData.zodError.fieldErrors);
        } else {
          setError({ "Server error": [e.message] });
        }
      }
    },
  });

  const signupUser = () => {
    setError(null);
    signupMutation.mutate({ name, email, password, repPassword });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupUser();
  };

  const startingError = useMemo(
    () => error && Object.entries(error)?.[0],
    [error]
  );

  const isSubmitDisabled = !name || !email || !password || !repPassword;

  return (
    <>
      <form
        className="mb-3 mt-8 flex w-full flex-col items-center justify-center gap-y-6 text-xl text-blue-500"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="w-5/6 rounded border-2 px-2 py-1 text-main placeholder:text-base placeholder:italic placeholder:text-slate-400 dark:text-mainDark sm:w-3/5"
          placeholder="Name"
          aria-label="Name"
          name="userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-5/6 rounded border-2 px-2 py-1 text-main placeholder:text-base placeholder:italic placeholder:text-slate-400 dark:text-mainDark sm:w-3/5"
          placeholder="Email"
          aria-label="Email"
          name="userMail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-5/6 rounded border-2 px-2 py-1 text-main placeholder:text-base placeholder:italic placeholder:text-slate-400 dark:text-mainDark sm:w-3/5"
          placeholder="Password"
          aria-label="Password"
          name="userPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-5/6 rounded border-2 px-2 py-1 text-main placeholder:text-base placeholder:italic placeholder:text-slate-400 dark:text-mainDark sm:w-3/5"
          placeholder="Repeat password"
          aria-label="Repeat password"
          name="userRepPassword"
          value={repPassword}
          onChange={(e) => setRepPassword(e.target.value)}
          required
        />
        <button
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          className="mt-2 flex w-5/6 items-center justify-center rounded-md border-4 border-rose-600 px-10 py-2 text-xl text-rose-600 hover:border-rose-400 hover:text-rose-400 disabled:border-rose-300 disabled:text-rose-300 dark:border-rose-400 dark:text-rose-400 dark:hover:border-rose-300 dark:hover:text-rose-300 sm:w-3/5"
          type="submit"
        >
          Sign Up!
        </button>
      </form>
      {startingError && (
        <p className="mt-3 text-center text-xl text-rose-600">
          {startingError[0]}: {startingError[1]?.[0]}
        </p>
      )}
    </>
  );
};
