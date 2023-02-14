import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BufferGeometry } from "three";

export default function CustomObject() {
  const geometryRef = useRef<BufferGeometry>(null);

  const verticesCount = 10 * 3;
  //10개 triangles (triangle은 3개의 vertex를 갖고있음)

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);
    //각 vertex 마다 xyz축이 존재해 3을 곱함

    for (let i = 0; i < verticesCount * 3; i++) {
      positions[i] = Math.random() - 0.5 * 3;
      // -0.5 ~ 0.5
    }

    return positions;
  }, []);
  //[]로 둔다면 계산한 값을 계속 Memorize 하고있음

  useEffect(() => {
    geometryRef.current?.computeVertexNormals();
  }, []);
  //[]로 둔다면 첫번째 렌더 이후에 1번 렌더를해줌

  return (
    <mesh position={[3, 1, 1]}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}
