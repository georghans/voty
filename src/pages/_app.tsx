import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { Navbar } from "../components/layout/Navbar";
import "../styles/globals.css";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex min-h-[calc(100vh-52px)] w-full min-w-full flex-col">
      <Navbar />

      <div className="flex w-full flex-grow flex-col justify-center overflow-x-hidden py-6 ">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default trpc.withTRPC(MyApp);
