import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { Loading, LoadingSpinner } from "~/components/loading";

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
  console.log({ user });

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
        placeholder="What's on your emoji today?"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};
const Posts = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (!data)
    return (
      <div className="border--400 border-b p-4 font-bold text-red-500">
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
              {author.username}
              <span className="font-normal text-slate-400">
                {`@${author.username} · ${dayjs(post.createdAt).fromNow()}`}
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
