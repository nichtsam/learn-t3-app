import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { Loading, LoadingSpinner } from "~/components/loading";
import {
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Learn T3 App</title>
        <meta name="description" content="Me learning t3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <div className="m-auto h-full border-x border-slate-400 md:max-w-2xl">
          <Header />
          <CreatePostWizard />
          <Posts />
        </div>
      </main>
    </>
  );
};

const Header = () => (
  <div className="border-b border-slate-400 p-4">Header</div>
);

const CreatePostWizard = () => {
  const { user, isLoaded } = useUser();
  const ctx = api.useContext();

  const { mutate, isLoading: isCreatingPost } = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.post.invalidate();
    },
    onError: (error) => {
      const zodError = error.data?.zodError?.fieldErrors.content;
      if (zodError && zodError[0]) {
        toast.error(zodError[0]);
      } else {
        toast.error(
          `Failed to post,
           are you spamming or am I breaking?`
        );
      }
    },
  });

  const [content, setContent] = useState("");

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setContent(e.target.value);
  };

  const handlePost = () => {
    mutate({ content: content });
  };

  const handleEnterPressed: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePost();
    }
  };

  if (!isLoaded) return null;
  if (!user)
    return (
      <div className="border--400 border-b p-4 font-bold text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div className="flex gap-4 border-b border-slate-400 p-4">
      <Image
        src={user.profileImageUrl}
        height={48}
        width={48}
        className="h-12 w-12 rounded-full"
        alt="user profile image"
      />
      <input
        value={content}
        onChange={handleInput}
        placeholder="What's on your emoji today?"
        className="grow bg-transparent outline-none"
        disabled={isCreatingPost}
        onKeyDown={handleEnterPressed}
      />
      {content && (
        <div className="flex w-16 items-center justify-end">
          {isCreatingPost && <LoadingSpinner size={16} />}
          <button
            disabled={isCreatingPost}
            onClick={handlePost}
            {...(isCreatingPost && { className: "text-slate-400" })}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};
const Posts = () => {
  const { data, isLoading, isFetching } = api.post.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (!data)
    return (
      <div className="border--400 border-b p-4 font-bold text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div>
      {isFetching && (
        <div className="flex items-center justify-center gap-4 border-b border-slate-400 p-4">
          <LoadingSpinner />
        </div>
      )}
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

export default Home;
