import { createProxySSGHelpers as createInnerProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";

export const createProxySSGHelpers = () =>
  createInnerProxySSGHelpers({
    router: appRouter,
    ctx: { ...createInnerTRPCContext({}), currentUserId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
