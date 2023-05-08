import { ClientProvider } from "~/providers/trpcClient";
import { EffectorAppNext } from "~/providers/effector";
import { Header } from '~/widgets/header';
import { Footer } from '~/widgets/footer';

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    tag: string;
    item: string;
  }
}) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return (
    <ClientProvider>
      <EffectorAppNext>
        <Header />
        <div className="sm:h-[calc(100%-75px)] w-full flex flex-nowrap justify-center">
          <div className="bg-[url(https://picsum.photos/600)] bg-no-repeat bg-cover w-1/2 hidden sm:block"></div>
          {children}
        </div>
        <Footer position="initial" />
      </EffectorAppNext>
    </ClientProvider>
  )
}
