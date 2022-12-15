import clsx from "clsx";

export const Spinner = ({ main }: { main?: boolean }) => {
  return (
    <div
      className={clsx(
        main && "flex h-[80vh] w-screen items-center justify-center"
      )}
    >
      <div
        className={clsx(
          "h-12 w-12 animate-spin rounded-full border-4 border-dashed border-neutral border-t-transparent"
        )}
      />
    </div>
  );
};
