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
        <title>{seoTitle} | VivleThea 3D Interactive</title>
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
