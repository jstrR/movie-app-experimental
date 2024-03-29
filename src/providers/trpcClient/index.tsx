"use client";
import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { $currentUser } from "~/entities/user/model";
import type { AppRouter } from "~/server/api/root";
import { env } from "~/env.mjs";

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${
      process.env.PORT || ""
    }`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const createTrpcClient = (cookies?: string, userToken?: string) => {
  return trpc.createClient({
    transformer: superjson,
    links: [
      loggerLink({
        enabled: () => process.env.NODE_ENV !== "production",
      }),
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
        headers() {
          return {
            cookie: cookies,
            "x-trpc-source": "react",
            ...(userToken && { Authorization: userToken }),
          };
        },
      }),
    ],
  });
};

export function ClientProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { mutations: {} } })
  );
  const currentUser = useUnit($currentUser);

  const [trpcClient, setTrpcClient] = useState(() =>
    createTrpcClient(props.cookies)
  );

  useEffect(() => {
    if (currentUser?.token) {
      setTrpcClient(createTrpcClient(props.cookies, currentUser?.token));
    }
  }, [currentUser?.token, props.cookies]);

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </trpc.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
