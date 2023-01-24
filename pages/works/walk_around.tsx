import { useEffect, useRef } from "react";
import Layout from "../../components/layout";
import * as THREE from "three";
import {
  Clock,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export default function WalkAround() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const clock: Clock = new THREE.Clock();
    const scene: Scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88ccee);
    scene.fog = new THREE.Fog(0x88ccee, 0, 50);

    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.rotation.order = "YXZ";

    const fillLight1: HemisphereLight = new THREE.HemisphereLight(
      0x4488bb,
      0x002244,
      0.5
    );
    fillLight1.position.set(2, 1, 1);
    scene.add(fillLight1);

    const dirLit: DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLit.position.set(-5, 25, -1);
    dirLit.castShadow = true;
    dirLit.shadow.camera.near = 0.01;
    dirLit.shadow.camera.far = 500;
    dirLit.shadow.camera.right = 30;
    dirLit.shadow.camera.left = -30;
    dirLit.shadow.camera.top = 30;
    dirLit.shadow.camera.bottom = -30;
    dirLit.shadow.mapSize.width = 1024;
    dirLit.shadow.mapSize.height = 1024;
    dirLit.shadow.radius = 4;
    dirLit.shadow.bias = -0.00006;
    scene.add(dirLit);

    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }, [canvasRef]);

  return (
    <Layout seoTitle="Walk_Around">
      <div className="bg-black w-full h-full text-white flex items-center justify-center">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </Layout>
  );
}
