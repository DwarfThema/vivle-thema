import Head from "next/head";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
  isMain?: boolean;
}
export default function Layout({ children, seoTitle, isMain }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{seoTitle} | VivleThema 3D Interactive</title>
        <meta content="Vivle-Thema" property="og:title" />
        <meta content="//www.vivle-thema.vercel.app/" property="og:url" />
        <meta content="VivleThema 3D Interactive" property="og:description" />
        <meta content="/dwarfthema.png" property="og:image" />
      </Head>
      {isMain ? null : (
        <Link href="/" className="fixed top-2 left-2 text-2xl">
          ⬅️
        </Link>
      )}
      {children}
    </>
  );
}
