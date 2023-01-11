import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  setTitle?: string;
}
export default function Layout({ children, setTitle }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{setTitle} | VivleThea 3D Interactive</title>
      </Head>
      <div className="w-screen h-screen">{children}</div>
    </>
  );
}
