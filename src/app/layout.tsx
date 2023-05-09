import './globals.css';
import { EffectorNext } from "@effector/next";

export const metadata = {
  title: 'Movie-App-experimental',
  description: 'Generated by create-t3-app Movie-App and Next.js v13 experimental features',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full"><EffectorNext>{children}</EffectorNext></body>
    </html>
  );
}