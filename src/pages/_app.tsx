import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";

dayjs.extend(relativeTime);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
