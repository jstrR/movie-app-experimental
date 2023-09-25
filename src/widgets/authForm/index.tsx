export const AuthForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col flex-nowrap items-center sm:w-1/2 ">
      <div className="mt-8 flex w-full grow-[9] flex-col items-center justify-center sm:mt-0">
        {children}
      </div>
      <div className="flex grow-[1] flex-col justify-end">
        <h2 className="mb-4 flex justify-end text-xl font-bold text-main dark:text-mainDark">
          Copyright © Movie-App {new Date().getFullYear()}
        </h2>
      </div>
    </div>
  );
};
