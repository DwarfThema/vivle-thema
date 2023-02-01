import { Canvas, useFrame } from "@react-three/fiber";
import Layout from "../../components/layout";

export default function LightBulb() {
  return (
    <Layout>
      <div id="canvas-container" className="h-screen w-full">
        <Canvas>
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
