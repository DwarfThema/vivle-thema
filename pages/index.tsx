import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Layout setTitle="Home">
        <div className="bg-black w-full h-full text-white flex flex-col items-center justify-center">
          <div className="text-4xl font-medium">VivleThema 3D Interactive</div>
          <ul className="mt-7 justify-center">
            <li className="w-full">
              <Link href="/works/bounce_material_ball" className="text-xl">
                Bounce Material Ball
              </Link>
            </li>
            <li className="w-full mt-1">
              <Link
                href="/works/bounce_material_ball"
                className="text-xl text-center w-full block"
              >
                👷🏻 Ready.. 👷🏻
              </Link>
            </li>
          </ul>
        </div>
      </Layout>
    </>
  );
}
