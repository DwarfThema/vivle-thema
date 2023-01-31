import { useEffect, useRef, useState } from "react";
import {
  Clock,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import * as THREE from "three";
import Layout from "../../components/layout";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function DwarfTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setwidth] = useState<number>(0);
  const resizeWindow = () => {
    setwidth(window.innerWidth);
  };

  useEffect(() => {
    setwidth(window.innerWidth);

    // clock / scene / camera / renderer

    const clock: Clock = new THREE.Clock();
    const scene: Scene = new THREE.Scene();
    scene.background = new THREE.Color("#81ecec");

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

    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.rotation.order = "YXZ";
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 2);

    controls.update();

    /// light ///
    const fillLight: HemisphereLight = new THREE.HemisphereLight(
      "#81ecec",
      "#fdcb6e",
      0.5
    );
    fillLight.position.set(2, 1, 1);
    scene.add(fillLight);

    const dirLight: DirectionalLight = new THREE.DirectionalLight(
      "#ffeaa7",
      0.8
    );
    dirLight.position.set(-5, 25, -1);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.01;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.radius = 4;
    dirLight.shadow.bias = -0.00006;
    scene.add(dirLight);

    /// Mesh ///
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const planeMat = new THREE.MeshBasicMaterial({
      color: "#dfe6e9",
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    scene.add(planeMesh);

    /// function ///
    function onWindowResize() {
      resizeWindow();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    const STEPS_PER_FRAME: number = 5;
    function animate() {
      requestAnimationFrame(animate);

      const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

      for (let i = 0; i < STEPS_PER_FRAME; i++) {}

      controls.update();

      renderer.render(scene, camera);
    }

    renderer.render(scene, camera);
  }, [canvasRef]);

  return (
    <Layout seoTitle="dwarfTest">
      <div className="bg-black w-full h-full text-white flex items-center justify-center absolute">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </Layout>
  );
}
