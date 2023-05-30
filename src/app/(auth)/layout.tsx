import { ClientProvider } from "~/providers/trpcClient";
import { Header } from "~/widgets/header";
import { Footer } from "~/widgets/footer";

export default function AuthLayout({
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
      <main className="flex w-full flex-nowrap justify-center sm:h-[calc(100%-75px)]">
        <div className="hidden w-1/2 bg-[url(https://picsum.photos/600)] bg-cover bg-no-repeat sm:block"></div>
        {children}
      </main>
      <Footer />
    </ClientProvider>
  );
}
