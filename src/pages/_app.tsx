import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";

dayjs.extend(relativeTime);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Learn T3 App</title>
        <meta name="description" content="Me learning t3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Toaster position="bottom-left" reverseOrder={true} />
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
