import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUser } from "~/utils/filterUser";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.string())
    .query(async ({ input: username }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [username],
        limit: 1,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find user with given username.",
        });
      }

      return filterUser(user);
    }),
});
