import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
}
export default function Layout({ children, seoTitle }: LayoutProps) {
  return (
    <div className="w-screen h-screen">
      <Head>
        <title>{seoTitle} | VivleThea 3D Interactive</title>
      </Head>
      {children}
    </div>
  );
}
