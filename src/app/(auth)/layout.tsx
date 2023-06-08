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
    <>
      <main className="flex h-[calc(100%-125px)] w-full flex-nowrap justify-center sm:h-[calc(100%-75px)]">
        <div className="hidden w-1/2 bg-[url(https://picsum.photos/600)] bg-cover bg-no-repeat sm:block"></div>
        {children}
      </main>
    </>
  );
}
