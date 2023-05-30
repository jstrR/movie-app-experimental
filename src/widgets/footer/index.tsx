export const Footer = ({
  position = "initial",
}: {
  position?: "sticky" | "fixed" | "initial";
}) => {
  return (
    <footer
      className={`${position} bottom-0 mx-auto w-full bg-gray-200 p-4 text-center text-2xl font-bold text-mainColor`}
    >
      <h2>Movie-App</h2>
    </footer>
  );
};
