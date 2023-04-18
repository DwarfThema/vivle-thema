import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, MeshBasicMaterial } from "three";

import {
  MeshReflectorMaterial,
  Float,
  Text,
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

  const rotateCubeRef = useRef<Mesh>(null!);

  const { camera, gl } = useThree();
  //console.log(camera, gl);

  useFrame((state, delta) => {
    /*     //센터점을 보며 등속 원운동 하는 카메라
    if (state.camera) {
      const angle = state.clock.elapsedTime;
      state.camera.position.x = Math.sin(angle / 2) * 4;
      state.camera.position.z = Math.cos(angle / 2) * 4;

      state.camera.lookAt(0, 0, 0);
    } */

    if (cubeRef.current) {
      // rotates the object
      /* cubeRef.current.rotation.x += 0.01; */

      const angle = state.clock.elapsedTime;

      /*       state.camera.position.x = Math.sin(angle) * 8;
      state.camera.position.z = Math.cos(angle) * 8; */
      //state.camera.lookAt(0, 0, 0);

      groupRef.current.rotation.y += state.clock.elapsedTime / 50000;
      //delta를 사용해서 deltatime을 적용
    }
  });

  return (
    <>
      <OrbitControls makeDefault />

      {/*       <group>
        <Html
          position={[0, 2, 0]}
          wrapperClass="label"
          className="text-[100px] font-extrabold w-[1000px] text-center"
          center
          distanceFactor={6}
        >
          등속 원운동
        </Html>
        <mesh ref={rotateCubeRef}>
          <boxGeometry />
          <meshStandardMaterial args={[{ color: "red" }]} />
        </mesh>

        <mesh
          scale={[10, 10, 10]}
          rotation-x={-Math.PI * 0.5}
          position-y={"-2"}
        >
          <planeGeometry />
          <meshStandardMaterial args={[{ color: "blue" }]} />
        </mesh>
      </group> */}
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
            wrapperClass="label" /* HTML 마크업라벨을 정할 수 있음 */
            className="text-3xl w-[500px]"
            center /* 센터로 HTML 오브젝트 피봇을 변경함. 기존은 왼쪽 아래에 피봇이 존재 */
            distanceFactor={
              10
            } /* 특정 크기로 고정해서 멀리서 보면 10정도 Factor를 갖게 해줌 */
            /* occlude={[cubeRef, sphereRef]} occlude를 줘서 해당 ref에 맞춰 HTML 을 숨겨줌  */
          >
            HTML을 사용하면 간단한 텍스트를 작성할 수 있습니다.
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
        {/* <meshStandardMaterial color="greenyellow" /> */}

        {/* MeshReflectiorMtl 은 말 그대로 쉽게 reflection을 구현해준다. */}
        <MeshReflectorMaterial
          resolution={512}
          /* blur 는 최대 1000 으로 구성되어있고 mixBlur와 함께 쓰여야 한다. */
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={
            0.5
          } /* mirror는 필수사항 얼마나 mirror 하게 표현 할지. 프레넬이 적용된듯한느낌 */
          color="greenyellow"
        />
      </mesh>

      {/* Float를 사용하면 표류하는듯한 느낌의 표현을 쉽게줄 수 있다. */}
      <Float speed={5} floatIntensity={0}>
        {/* Drei의 Text를 사용하면 메쉬형태의 Text를 사용 가능 */}
        <Text
          font="/fonts/dongle-v8-latin-regular.woff" /* Font는 반드시 woff 파일로 적용해야하고 pulbic에서 실행해야함. woff파일은 google webfontshelper 에서 구하면됨 */
          fontSize={1}
          //color="salmon"
          position-y={2}
          maxWidth={2}
          textAlign="center"
        >
          I Love R3F
          <meshNormalMaterial /* meshNormalMtl을 사용하면 카메라 위치에 따라 색이 변경됨 */
          />
        </Text>
      </Float>

      <CustomObject />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </>
  );
}
