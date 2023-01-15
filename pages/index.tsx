import { Inter } from "@next/font/google";
import Layout from "../components/layout";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout seoTitle="Home" isMain={true}>
      <div className="bg-black text-white flex justify-center ">
        <div className="h-screen flex flex-col items-center justify-center w-64">
          <div className="text-4xl font-medium text-center">
            VivleThema
            <br />
            3D Interactive
          </div>
          <ul className="mt-7 items-start w-full list-disc">
            <li className="">
              <Link href="/works/bounce_material_ball" className="text-xl">
                Bounce Material Ball
              </Link>
            </li>
            <li className=" mt-1">
              <Link
                href="https://www.ebsgamedocu.com"
                className="text-xl text-center w-full"
              >
                EBS Docuprime <br /> {`<Serious About Games>`}
              </Link>
            </li>
            <li className=" mt-1">
              <Link href="/" className="text-xl text-center w-full">
                👷🏻 Ready.. 👷🏻
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="fixed bottom-0 text-white text-opacity-70 text-xs text-center w-full mb-6 pt-3 border-solid border-t-2 border-white border-opacity-30">
        Dwarfthema@gmail.com <br /> Copyright ⓒ 2023 VivleThema. All Right
        Reserved.
      </div>
    </Layout>
  );
}
