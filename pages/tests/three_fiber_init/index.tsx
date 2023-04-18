import { Canvas, extend, useFrame } from "@react-three/fiber";

import Layout from "../../../components/layout";
import TestGroup from "./assets/testGroup";
import * as THREE from "three";
import ReflectionGroup from "./assets/reflectionGroup";

export default function ThreeFiverInit() {
  return (
    <Layout seoTitle="R3F">
      <div id="canvas-container" className="h-screen w-full">
        <Canvas
          className="bg-slate-100"
          /* orthographic */
          /* dpr={[1, 2]} */
          gl={{
            /* antialias: false, */
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding,
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6],
            /* zoom: 100, */
          }}
        >
          <ReflectionGroup />

          {/*           <TestGroup>
            <></>
          </TestGroup> */}
        </Canvas>
      </div>
    </Layout>
  );
}
