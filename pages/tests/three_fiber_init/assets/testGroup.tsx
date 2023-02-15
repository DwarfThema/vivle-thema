import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";

import {
  Html,
  OrbitControls,
  PivotControls,
  TransformControls,
} from "@react-three/drei";
import CustomObject from "./customObject";
/* import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ orbitControls: OrbitControls });
//이런식으로 네이티브 three를 사용함 */

interface LayoutProps {
  children: React.ReactNode;
}

export default function TestGroup({ children }: LayoutProps) {
  const [rotation, setRotation] = useState<number>(0);

  const cubeRef = useRef<Mesh>(null!);
  const sphereRef = useRef<Mesh>(null!);
  const groupRef = useRef<Group>(null!);

  const { camera, gl } = useThree();
  //console.log(camera, gl);

  /*   useFrame((state, delta) => {
    if (cubeRef.current) {
      // rotates the object
      cubeRef.current.rotation.x += 0.01;

      const angle = state.clock.elapsedTime;
      state.camera.position.x = Math.sin(angle / 3) * 8;
      state.camera.position.z = Math.cos(angle / 3) * 8;
      state.camera.lookAt(0, 0, 0);

      //groupRef.current.rotation.y += delta;
      //delta를 사용해서 deltatime을 적용
    }
  }); */

  return (
    <>
      <OrbitControls makeDefault />

      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry />
        <meshBasicMaterial args={[{ color: "red", wireframe: true }]} />
      </mesh>
      <TransformControls object={sphereRef} mode="scale" />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={2}
        axisColors={["purble", "yellow", "black"]}
        scale={150}
        fixed={true}
      >
        <mesh
          ref={cubeRef}
          position={[-2, -2, 0]}
          rotation={[10, rotation, 10]}
        >
          <boxGeometry attach="geometry" args={[1, 1, 1]} />

          <meshStandardMaterial attach="material" color="yellow" />

          <Html
            position={[0, -1, 0]}
            wrapperClass="label"
            className="text-3xl"
            center
            distanceFactor={6}
            occlude={[cubeRef, sphereRef]}
          >
            Box
          </Html>
        </mesh>
      </PivotControls>

      <group ref={groupRef} position={[1, 2, 1]}>
        <mesh position-x={10} rotation={[10, 10, rotation]}>
          <torusKnotBufferGeometry />
          <meshNormalMaterial />
        </mesh>

        <mesh position={[4, 4, 4]} rotation={[10, 10, rotation]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="mediumpurple" wireframe />
        </mesh>

        {children}
      </group>

      <mesh position-y={-4} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <CustomObject />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </>
  );
}
