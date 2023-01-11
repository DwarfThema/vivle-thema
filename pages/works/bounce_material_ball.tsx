import Layout from "../../components/layout";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import { AmbientLight, AnimationMixer, Clock, DirectionalLight } from "three";
import {
  GLTFLoader,
  GLTFLoaderPlugin,
} from "three/examples/jsm/loaders/GLTFLoader";

export default function BounceMaterialBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    const ambientLight: AmbientLight = new THREE.AmbientLight("white", 0.7);
    const dirLit: DirectionalLight = new THREE.DirectionalLight("white", 1);
    dirLit.position.x = -2;
    dirLit.position.z = 2;
    scene.add(ambientLight, dirLit);

    renderer.render(scene, camera);

    ///////////////////

    const gltfLoader: GLTFLoader = new GLTFLoader();
    let mixer: AnimationMixer;
    gltfLoader.load("/bounce_material_ball/BounceBall_Color.glb", (json) => {
      console.log(json);
      const ball = json.scene.children[0];
      scene.add(ball);

      mixer = new THREE.AnimationMixer(ball);
      const ballAnim = mixer.clipAction(json.animations[0]);
      const bounceAnim = mixer.clipAction(json.animations[1]);
      ballAnim.play();
      bounceAnim.play();
    });
    ///////////////////
    const clock: Clock = new THREE.Clock();

    function loop() {
      const Time = clock.getDelta();
      if (mixer) {
        mixer.update(Time / 1.5);
      }
      renderer.render(scene, camera);
      renderer.setAnimationLoop(loop);
    }

    loop();
  }, [canvasRef]);
  return (
    <>
      <Layout setTitle="Bounce_Material_Ball">
        <div className="bg-black w-full h-full text-white flex items-center justify-center">
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
      </Layout>
    </>
  );
}
