import { useRouter } from "next/router";

export const Navbar = () => {
  const router = useRouter();
  return (
    <header className="flex items-center bg-white ">
      <div
        className="ml-4 mt-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <span className=" font-lexend text-3xl font-light text-neutral">
          VOTY
        </span>
      </div>
    </header>
  );
};
