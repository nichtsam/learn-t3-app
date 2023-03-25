import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserProfile,
} from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <ClerkLoading>
          <p className="text-5xl text-white">Loading...</p>
        </ClerkLoading>

        <SignedOut>
          <div className="w-48">
            <SignInButton mode="modal">
              <button className="w-full rounded-3xl bg-white p-4 text-xl font-bold">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Post />
          <div className="flex flex-col gap-4 p-10">
            <UserProfile />
            <SignOutButton>
              <button className="w-full rounded-3xl bg-white p-4 text-xl font-bold">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </main>
    </>
  );
};

const Post = () => {
  const { data } = api.post.getAll.useQuery();

  return (
    <div>
      {data?.map((post) => (
        <p key={post.id}>{post.content}</p>
      ))}
    </div>
  );
};

export default Home;
