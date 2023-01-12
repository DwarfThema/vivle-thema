import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
}
export default function Layout({ children, seoTitle }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{seoTitle} | VivleThea 3D Interactive</title>
      </Head>
      <div className="w-screen h-screen">{children}</div>
    </>
  );
}
