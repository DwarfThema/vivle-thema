import Layout from "../../components/layout";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Clock,
  TextureLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { render } from "react-dom";
import Link from "next/link";
import { addEmitHelpers } from "typescript";

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
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(5, 1, 10);
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);

    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

    scene.add(camera);

    renderer.render(scene, camera);

    let mixer: AnimationMixer;
    let mesh: THREE.Mesh;
    let ballModel: THREE.Object3D;

    //////// HDRI ////////
    new RGBELoader().load(
      "/bounce_material_ball/belfast_sunset_puresky_4k.hdr",
      (hdrmap) => {
        hdrmap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = hdrmap;
        scene.environment = hdrmap;
        render();

        //////// Mesh Load ////////
        const gltfLoader: GLTFLoader = new GLTFLoader();
        gltfLoader.load("/bounce_material_ball/BounceBall_Mtl.glb", (json) => {
          ballModel = json.scene.children[0];
          scene.add(ballModel);

          //////// Material ////////
          const textureLoader = new THREE.TextureLoader() as TextureLoader;

          const diffuse = textureLoader.load(
            "/bounce_material_ball/ChristmasTreeOrnament/ChristmasTreeOrnament003_2K_Color.jpg"
          );

          const noraml = textureLoader.load(
            "/bounce_material_ball/ChristmasTreeOrnament/ChristmasTreeOrnament003_2K_NormalDX.jpg"
          );

          const displacement = textureLoader.load(
            "/bounce_material_ball/ChristmasTreeOrnament/ChristmasTreeOrnament003_2K_Displacement.jpg"
          );

          const metalness = textureLoader.load(
            "/bounce_material_ball/ChristmasTreeOrnament/ChristmasTreeOrnament003_2K_Metalness.jpg"
          );

          const roughness = textureLoader.load(
            "/bounce_material_ball/ChristmasTreeOrnament/ChristmasTreeOrnament003_2K_Roughness.jpg"
          );

          mesh = ballModel.children[0] as THREE.Mesh;
          mesh.material = new THREE.MeshPhysicalMaterial({
            map: diffuse,
            normalMap: noraml,
            displacementMap: displacement,
            displacementScale: 0.01,
            metalnessMap: metalness,
            metalness: 1,
            roughnessMap: roughness,
          });

          //////// AnimationClip ////////
          mixer = new THREE.AnimationMixer(ballModel);
          console.log(json);

          const ballAnim = mixer.clipAction(json.animations[0]);
          const bounceAnim = mixer.clipAction(json.animations[1]);
          ballAnim.play();
          bounceAnim.play();

          render();
        });
      }
    );

    //////// orbitcontorl ////////

    const orbitcontrols: OrbitControls = new OrbitControls(
      camera,
      renderer.domElement
    );

    orbitcontrols.addEventListener("change", render);
    orbitcontrols.target.set(0, 0, -1);
    orbitcontrols.minDistance = 5;
    orbitcontrols.maxDistance = 15;
    orbitcontrols.enablePan = false;
    orbitcontrols.update();

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
    <Layout seoTitle="Bounce_Material_Ball">
      <div className="bg-black w-full h-full text-white flex items-center justify-center">
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </Layout>
  );
}
