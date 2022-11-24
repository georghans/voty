import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { Navbar } from "../components/layout/Navbar";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
