import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/layout";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Learn T3 App | Post</title>
      </Head>
      <Layout>
        <Header />
      </Layout>
    </>
  );
};

const Header = () => <div className="border-b border-slate-400 p-4">Post</div>;

export default SinglePostPage;
