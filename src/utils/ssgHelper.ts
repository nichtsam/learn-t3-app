import { createProxySSGHelpers as createInnerProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export const createProxySSGHelpers = () =>
  createInnerProxySSGHelpers({
    router: appRouter,
    ctx: { ...createInnerTRPCContext({}), currentUserId: null },
  });
