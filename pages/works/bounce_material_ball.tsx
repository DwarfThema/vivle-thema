import Layout from "../../components/layout";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  MeshStandardMaterial,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { render } from "react-dom";
import Link from "next/link";

export default function BounceMaterialBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //////// Basic ////////
    const scene: THREE.Scene = new THREE.Scene();
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight
    );
    camera.position.y = 10;
    camera.position.z = 10;
    scene.add(camera);

    const orbitcontrols: OrbitControls = new OrbitControls(
      camera,
      renderer.domElement
    );

    orbitcontrols.addEventListener("change", render);
    orbitcontrols.target.set(0, 0, -0.2);
    orbitcontrols.update();

    //////// Lighting ////////

    const ambientLight: AmbientLight = new THREE.AmbientLight("white", 0.7);
    const dirLit: DirectionalLight = new THREE.DirectionalLight("white", 1);
    dirLit.position.x = -2;
    dirLit.position.z = 2;
    scene.add(ambientLight);

    renderer.render(scene, camera);

    //////// HDRI ////////
    new RGBELoader().load(
      "/bounce_material_ball/belfast_sunset_puresky_4k.hdr",
      (hdrmap) => {
        hdrmap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = hdrmap;
        scene.environment = hdrmap;

        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.7;
      }
    );

    //////// Mesh Load ////////

    const gltfLoader: GLTFLoader = new GLTFLoader();
    let mixer: AnimationMixer;
    gltfLoader.load("/bounce_material_ball/BounceBall_Color.glb", (json) => {
      const ball = json.scene.children[0];
      const mtl: MeshStandardMaterial = new THREE.MeshStandardMaterial({
        color: "white",
      });

      scene.add(ball);

      mixer = new THREE.AnimationMixer(ball);
      const ballAnim = mixer.clipAction(json.animations[0]);
      const bounceAnim = mixer.clipAction(json.animations[1]);
      ballAnim.play();
      bounceAnim.play();
    });

    //////// Life Cycle _ Update ////////
    const clock: Clock = new THREE.Clock();

    function Update() {
      const Time = clock.getDelta();
      if (mixer) {
        mixer.update(Time / 1.5);
      }
      renderer.render(scene, camera);
      renderer.setAnimationLoop(Update);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    Update();
  }, [canvasRef]);
  return (
    <>
      <Layout seoTitle="Bounce_Material_Ball">
        <div className="bg-black w-full h-full text-white flex items-center justify-center">
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
      </Layout>
    </>
  );
}
