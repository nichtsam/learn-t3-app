import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "~/utils/ssgHelper";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery(username);

  if (!data) {
    return (
      <div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center text-4xl">
        <div className="text-center">
          <p>404</p>
          <p>User Not Found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learn T3 App | Profile</title>
      </Head>
      <main className="h-screen">
        <div className="m-auto h-full border-x border-slate-400 md:max-w-2xl">
          <Profile
            username={data.username ?? username}
            profileImageUrl={data.profileImageUrl}
          />
        </div>
      </main>
    </>
  );
};

const Profile = ({
  username,
  profileImageUrl,
}: {
  username: string;
  profileImageUrl: string;
}) => (
  <div className="relative h-40 bg-slate-600">
    <Image
      src={profileImageUrl}
      height={96}
      width={96}
      className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-2 border-black"
      alt={`${username}'s profile image`}
    />
    <span className="bold absolute -bottom-10 left-32 text-3xl">{`@${username}`}</span>
  </div>
);

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = createProxySSGHelpers();

  const slug = ctx.params?.slug as string; // this route should always have it.
  const username = slugToUsername(slug);

  await ssg.profile.getUserByUsername.prefetch(username);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

const slugToUsername = (slug: string) => slug.slice(1);

export default ProfilePage;
