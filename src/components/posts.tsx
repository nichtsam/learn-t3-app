import type { Post } from "@prisma/client";
import { Loading } from "./loading";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

export interface PostsProps {
  data?: {
    post: Post;
    author: {
      username: string;
      profileImageUrl: string;
    };
  }[];
  loading?: boolean;
}
export const Posts = ({ data, loading }: PostsProps) => {
  if (loading) return <Loading />;
  if (!data)
    return (
      <div className="border-b border-slate-400 p-4 font-bold text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div>
      {data?.map(({ post, author }) => (
        <div key={post.id} className="flex gap-4 border-b border-slate-400 p-4">
          <Image
            src={author?.profileImageUrl}
            height={48}
            width={48}
            className="h-12 w-12 rounded-full"
            alt={`${author.username}'s profile image`}
          />
          <div className="flex flex-col">
            <span className="flex gap-2 font-bold">
              <Link href={`/@${author.username}`}>
                <span className="hover:underline">{author.username}</span>
              </Link>
              <span className="inline-flex gap-2 font-normal text-slate-400">
                <Link className="hover:underline" href={`/@${author.username}`}>
                  <span>@{author.username}</span>
                </Link>
                <span>·</span>
                <Link className="hover:underline" href={`/post/${post.id}`}>
                  <span>{dayjs(post.createdAt).fromNow()}</span>
                </Link>
              </span>
            </span>
            <span>{post.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
