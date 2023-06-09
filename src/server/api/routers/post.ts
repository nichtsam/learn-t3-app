import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUser } from "~/utils/filterUser";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  getPostsByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: userId,
        },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });

      const author = filterUser(await clerkClient.users.getUser(userId));

      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      return posts.map((post) => ({
        post,
        author: {
          ...author,
          // too lazy too handle all these stuff.
          username: author.username as string,
        },
      }));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    const authors = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUser);

    return posts.map((post) => {
      const author = authors.find((author) => author.id === post.authorId);

      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed!").min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input: { content } }) => {
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      return ctx.prisma.post.create({
        data: {
          authorId,
          content,
        },
      });
    }),
});
