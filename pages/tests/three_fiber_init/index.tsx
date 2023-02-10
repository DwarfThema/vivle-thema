import { Canvas, extend, useFrame } from "@react-three/fiber";

import Layout from "../../../components/layout";
import TestGroup from "./assets/testGroup";

export default function ThreeFiverInit() {
  return (
    <Layout seoTitle="R3F">
      <div id="canvas-container" className="h-screen w-full">
        <Canvas>
          <TestGroup>
            <></>
          </TestGroup>
        </Canvas>
      </div>
    </Layout>
  );
}
