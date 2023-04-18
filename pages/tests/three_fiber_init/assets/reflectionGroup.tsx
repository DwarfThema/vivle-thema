import { Float, MeshReflectorMaterial, OrbitControls } from "@react-three/drei";

export default function ReflectionGroup() {
  return (
    <>
      <OrbitControls />
      <Float speed={5} floatIntensity={1}>
        <mesh position={[0, 0.2, 0]} scale={0.5}>
          <torusKnotBufferGeometry />
          <meshNormalMaterial />
        </mesh>
      </Float>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.5}
          color="orange"
        />
      </mesh>

      <ambientLight intensity={0.1} />
    </>
  );
}
