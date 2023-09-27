import "./globals.css";
import { EffectorNext } from "@effector/next";
import { cookies } from "next/headers";

import { ClientProvider } from "~/providers/trpcClient";
import { Header } from "~/widgets/header";
import { refreshCookieName } from "~/shared/auth";
import { appRouter } from "~/server/api/root";

export const metadata = {
  title: "Movie-App-experimental",
  description:
    "Generated by create-t3-app Movie-App and Next.js v13 experimental features",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const refreshCookie = cookies().get(refreshCookieName);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const serverClient = appRouter.createCaller({} as any);

  let currentSession;
  if (refreshCookie) {
    currentSession = await serverClient.session.getSessionSsr({
      token: refreshCookie?.value || "",
    });
  }

  const { name = "", mail = "", role = "" } = currentSession?.user || {};

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-mainBg dark:bg-mainBgDark">
        <EffectorNext>
          <ClientProvider>
            <Header
              user={
                currentSession
                  ? { name, mail, role, token: currentSession.token }
                  : undefined
              }
            />
            {children}
          </ClientProvider>
        </EffectorNext>
      </body>
    </html>
  );
}
