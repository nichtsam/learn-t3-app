import { ErrorBoundary } from "@highlight-run/react";
import { H } from "highlight.run";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { type AppType } from "next/app";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";

dayjs.extend(relativeTime);

H.init("kevnn3g3", {
  tracingOrigins: true,
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: [
      // insert urls you don't want to record here
    ],
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <ClerkProvider {...pageProps}>
        <IdentifyUser />
        <Component {...pageProps} />
      </ClerkProvider>
    </ErrorBoundary>
  );
};

const IdentifyUser = () => {
  const { user, isSignedIn } = useUser();
  if (isSignedIn) {
    H.identify(user.primaryEmailAddress?.emailAddress ?? user.id, {
      id: user.id,
    });
  }

  return null;
};

export default api.withTRPC(MyApp);
