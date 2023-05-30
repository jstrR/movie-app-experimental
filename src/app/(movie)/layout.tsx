import { ClientProvider } from "~/providers/trpcClient";
import { Header } from "~/widgets/header";
import { Footer } from "~/widgets/footer";

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
  params: {
    tag: string;
    item: string;
  };
}) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return (
    <ClientProvider>
      <Header />
      <main className="flex min-h-[calc(100dvh-75px-64px)]">{children}</main>
      <Footer />
    </ClientProvider>
  );
}
