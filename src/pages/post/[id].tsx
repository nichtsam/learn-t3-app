import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Learn T3 App | Post</title>
      </Head>
      <main className="h-screen">
        <div className="m-auto h-full border-x border-slate-400 md:max-w-2xl">
          <Header />
        </div>
      </main>
    </>
  );
};

const Header = () => <div className="border-b border-slate-400 p-4">Post</div>;

export default SinglePostPage;
