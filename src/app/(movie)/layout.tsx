import { ClientProvider } from '~/providers/trpcClient';
import { Header } from '~/widgets/header';

export default function MovieLayout({
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
      <Header />
      <main>{children}</main>
    </ClientProvider>
  )
}
