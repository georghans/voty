import Image from "next/image";
import { useRouter } from "next/router";

export const Navbar = () => {
  const router = useRouter();
  return (
    <header
      className="flex h-[60px] items-center space-x-2 bg-stone-900 p-8 sm:justify-center"
      onClick={() => router.push("/")}
    >
      <Image src="/logo.png" alt="voty logo" width={52} height={52} />
      <span className="text-3xl font-bold text-voty">VOTY</span>
    </header>
  );
};
