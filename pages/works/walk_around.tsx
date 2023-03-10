import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import * as THREE from "three";
import { Octree } from "three/examples/jsm/math/Octree";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  Clock,
  DirectionalLight,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from "three";
import { Capsule } from "three/examples/jsm/math/Capsule";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Btn from "../../components/btn";

interface ISphere {
  mesh: Mesh;
  collider: Sphere;
  velocity: Vector3;
}

export default function WalkAround() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = useState(0);
  const resizeWindow = () => {
    setWidth(window.innerWidth);
  };

  const [hdrMap, setHdrMap] = useState<string>(`quattro_canti_4k.hdr`);

  useEffect(() => {
    setWidth(window.innerWidth);

    const clock: Clock = new THREE.Clock();
    const scene: Scene = new THREE.Scene();
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

    //const stats = new Stats();

    const GRAVITY = 30;

    const NUM_SPHERES = 100;
    const SPHERE_RADIUS = 0.2;

    const STEPS_PER_FRAME = 5;

    const sphereGeometry: IcosahedronGeometry = new THREE.IcosahedronGeometry(
      SPHERE_RADIUS,
      5
    );
    const sphereMaterial: MeshLambertMaterial = new THREE.MeshLambertMaterial({
      color: 0x4834d4,
    });

    const spheres: ISphere[] = [];
    let sphereIdx = 0;

    for (let i = 0; i < NUM_SPHERES; i++) {
      const sphere: Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true;
      sphere.receiveShadow = true;

      scene.add(sphere);

      spheres.push({
        mesh: sphere,
        collider: new THREE.Sphere(
          new THREE.Vector3(0, -100, 0),
          SPHERE_RADIUS
        ),
        velocity: new THREE.Vector3(),
      });
    }
    const worldOctree: Octree = new Octree();

    const playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0, 1, 0),
      0.2
    );

    const playerVelocity = new THREE.Vector3();
    const playerDirection = new THREE.Vector3();

    let playerOnFloor = false;
    let mouseTime = 0;

    const vector1 = new THREE.Vector3();
    const vector2 = new THREE.Vector3();
    const vector3 = new THREE.Vector3();

    ///// ??? ????????? ?????? ?????? /////

    const keyStates: { [key: string]: boolean } = {};

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      keyStates[e.code] = true;
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      keyStates[e.code] = false;
    });

    document.addEventListener("mousedown", () => {
      document.body.requestPointerLock();
      mouseTime = performance.now();
    });

    document.addEventListener("mouseup", (e: MouseEvent) => {
      if (document.pointerLockElement === document.body) throwBall();
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= e.movementX / 500;
        camera.rotation.x -= e.movementY / 500;
      }
    });

    ///// ???????????? ?????? /////
    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      resizeWindow();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      //????????? ?????? ???????????? ??????

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //////// ???????????? ?????? ////////

    function throwBall() {
      const sphere = spheres[sphereIdx];
      camera.getWorldDirection(playerDirection);
      sphere.collider.center
        .copy(playerCollider.end)
        .addScaledVector(playerDirection, playerCollider.radius * 1.5);

      // ?????? ????????? ??? ?????? ???????????? ????????? ??????????????? ?????? ????????? ?????? ??? ?????? ??????
      const impulse: number =
        15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));

      sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
      sphere.velocity.addScaledVector(playerVelocity, 2);
      sphereIdx = (sphereIdx + 1) % spheres.length;
    }

    function playerCollisions() {
      const result = worldOctree.capsuleIntersect(playerCollider);
      playerOnFloor = false;

      if (result) {
        playerOnFloor = result.normal.y > 0;

        if (!playerOnFloor) {
          playerVelocity.addScaledVector(
            result.normal,
            -result.normal.dot(playerVelocity)
          );
        }

        playerCollider.translate(result.normal.multiplyScalar(result.depth));
      }
    }

    function updatePlayer(deltaTime: number) {
      let damping = Math.exp(-4 * deltaTime) - 1;
      if (!playerOnFloor) {
        playerVelocity.y -= GRAVITY * deltaTime;
        //?????? ?????? ?????????
        damping *= 0.1;
      }

      playerVelocity.addScaledVector(playerVelocity, damping);

      const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
      playerCollider.translate(deltaPosition);

      playerCollisions();

      camera.position.copy(playerCollider.end);
    }

    function playerSphereCollision(sphere: ISphere) {
      const center = vector1
        .addVectors(playerCollider.start, playerCollider.end)
        .multiplyScalar(0.5);

      const sphere_center = sphere.collider.center;

      const r = playerCollider.radius + sphere.collider.radius;
      const r2 = r * r;

      for (const point of [playerCollider.start, playerCollider.end, center]) {
        const d2 = point.distanceToSquared(sphere_center);

        if (d2 < r2) {
          const normal = vector1.subVectors(point, sphere_center).normalize();
          const v1 = vector2
            .copy(normal)
            .multiplyScalar(normal.dot(playerVelocity));
          const v2 = vector3
            .copy(normal)
            .multiplyScalar(normal.dot(sphere.velocity));

          playerVelocity.add(v2).sub(v1);
          sphere.velocity.add(v1).sub(v2);

          const d = (r - Math.sqrt(d2)) / 2;
          sphere_center.addScaledVector(normal, -d);
        }
      }
    }

    function spheresCollisions() {
      for (let i = 0, length = spheres.length; i < length; i++) {
        const s1 = spheres[i];

        for (let j = i + 1; j < length; j++) {
          const s2 = spheres[j];

          const d2 = s1.collider.center.distanceToSquared(s2.collider.center);
          const r = s1.collider.radius + s2.collider.radius;
          const r2 = r * r;

          if (d2 < r2) {
            const normal = vector1
              .subVectors(s1.collider.center, s2.collider.center)
              .normalize();
            const v1 = vector2
              .copy(normal)
              .multiplyScalar(normal.dot(s1.velocity));
            const v2 = vector3
              .copy(normal)
              .multiplyScalar(normal.dot(s2.velocity));

            s1.velocity.add(v2).sub(v1);
            s2.velocity.add(v1).sub(v2);

            const d = (r - Math.sqrt(d2)) / 2;

            s1.collider.center.addScaledVector(normal, d);
            s2.collider.center.addScaledVector(normal, -d);
          }
        }
      }
    }

    function updateSpheres(deltaTime: number) {
      spheres.forEach((sphere) => {
        sphere.collider.center.addScaledVector(sphere.velocity, deltaTime);

        const result = worldOctree.sphereIntersect(sphere.collider);

        if (result) {
          sphere.velocity.addScaledVector(
            result.normal,
            -result.normal.dot(sphere.velocity) * 1.5
          );
          sphere.collider.center.add(
            result.normal.multiplyScalar(result.depth)
          );
        } else {
          sphere.velocity.y -= GRAVITY * deltaTime;
        }

        const damping = Math.exp(-1.5 * deltaTime) - 1;
        sphere.velocity.addScaledVector(sphere.velocity, damping);

        playerSphereCollision(sphere);
      });

      spheresCollisions();

      for (const sphere of spheres) {
        sphere.mesh.position.copy(sphere.collider.center);
      }
    }

    function getForwardVector() {
      camera.getWorldDirection(playerDirection);
      playerDirection.y = 0;
      playerDirection.normalize();

      return playerDirection;
    }

    function getSideVector() {
      camera.getWorldDirection(playerDirection);
      playerDirection.y = 0;
      playerDirection.normalize();
      playerDirection.cross(camera.up);

      return playerDirection;
    }

    const hdrLoader = new RGBELoader().setPath("/walk_around/hdri/");

    const gltfLoader = new GLTFLoader().setPath("/walk_around/");

    function controls(deltaTime: number) {
      const speedDelta = deltaTime * (playerOnFloor ? 25 : 8) * 0.5;

      if (keyStates["KeyW"]) {
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
      }

      if (keyStates["KeyS"]) {
        playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
      }
      if (keyStates["KeyA"]) {
        playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
      }
      if (keyStates["KeyD"]) {
        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
      }
      if (keyStates["Digit1"]) {
        setHdrMap(`gothic_manor_01_4k.hdr`);
      }
      if (keyStates["Digit2"]) {
        setHdrMap(`quattro_canti_4k.hdr`);
      }

      if (playerOnFloor) {
        if (keyStates["Space"]) {
          playerVelocity.y = 6;
        }
      }
    }

    hdrLoader.load(`${hdrMap}`, (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = hdr;
      scene.environment = hdr;

      renderer.render(scene, camera);

      gltfLoader.load("KingsMan.glb", (gltf) => {
        scene.add(gltf.scene);
        worldOctree.fromGraphNode(gltf.scene);
        // ?????? ??????

        gltf.scene.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const mtl = mesh.material as THREE.MeshStandardMaterial;
            if (mtl.map) {
              mtl.map.anisotropy = 4;
            }
          }
        });

        const helper = new OctreeHelper(worldOctree, 0xff0000);
        helper.visible = false;
        scene.add(helper);

        animate();
      });
    });

    function teleportPlayerIfOob() {
      if (camera.position.y <= -25) {
        playerCollider.start.set(0, 0.35, 0);
        playerCollider.end.set(0, 1, 0);
        playerCollider.radius = 0.35;
        camera.position.copy(playerCollider.end);
        camera.rotation.set(0, 0, 0);
      }
    }

    function animate() {
      const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        controls(deltaTime);
        updatePlayer(deltaTime);
        updateSpheres(deltaTime);
        teleportPlayerIfOob();
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }, [canvasRef]);

  return (
    <Layout seoTitle="Walk_Around">
      {/*       <div>
        <Btn
          onClick={() => {
            setHdrMap(`gothic_manor_01_4k.hdr`);
          }}
          color="red"
        ></Btn>
        <Btn
          onClick={() => {
            setHdrMap(`quattro_canti_4k.hdr`);
          }}
          color="blue"
        ></Btn>
        <Btn
          onClick={() => {
            setHdrMap(`shanghai_bund_4k.hdr`);
          }}
          color="amber"
        ></Btn>
        <Btn
          onClick={() => {
            setHdrMap(`urban_street_01_4k.hdr`);
          }}
          color="green"
        ></Btn>
        <Btn
          onClick={() => {
            setHdrMap(`venice_sunset_4k.hdr`);
          }}
          color="purple"
        ></Btn>
      </div> */}

      {width >= 1025 ? null : (
        <div className="absolute h-screen w-full flex justify-around items-center">
          <div className="bg-white absolute z-10 rounded-lg">
            <div className=" text-red-900 text-4xl text-center font-extrabold px-5 py-2">
              DESKTOP ONLY
            </div>
          </div>
        </div>
      )}

      <div className="bg-black w-full h-full text-white flex items-center justify-center absolute -z-20">
        <div className="bg-white absolute -z-30 rounded-lg">
          <div className=" text-red-900 text-4xl text-center font-extrabold px-5 py-2">
            now Loading
          </div>
        </div>
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </Layout>
  );
}
