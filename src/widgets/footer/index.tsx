export const Footer = ({
  position = "initial",
}: {
  position?: "sticky" | "fixed" | "initial";
}) => {
  return (
    <footer
      className={`${position} bottom-0 mx-auto w-full bg-mainBg p-4 text-center text-2xl font-bold text-main dark:bg-mainBgDark dark:text-mainDark`}
    >
      <h2>Movie-App</h2>
    </footer>
  );
};
