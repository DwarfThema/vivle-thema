import { Canvas, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import Layout from "../../../components/layout";

export default function LightBulb() {
  return (
    <Layout>
      <div id="canvas-container" className="h-screen w-full">
        <Canvas>
          <OrbitControls enableDamping={false} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
          </mesh>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />
        </Canvas>
      </div>
    </Layout>
  );
}
