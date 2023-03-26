import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
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
    ).map(filterAuthor);

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
        content: z.string().emoji().min(1).max(255),
      })
    )
    .mutation(({ ctx, input: { content } }) => {
      const authorId = ctx.currentUserId;

      return ctx.prisma.post.create({
        data: {
          authorId,
          content,
        },
      });
    }),
});

const filterAuthor = (author: User) => {
  const { id, username, profileImageUrl } = author;
  return { id, username, profileImageUrl };
};
