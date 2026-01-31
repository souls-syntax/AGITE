import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin,VRMSpringBoneColliderShapeCapsule , VRMSpringBoneColliderShapeSphere } from '@pixiv/three-vrm';

// ... Setup renderer, camera, scene ...
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth /
  window.innerHeight, 0.1, 20.0 );
camera.position.set(0.0,0.65,3.0)

const rederer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
rederer.setSize( window.innerWidth, window.innerHeight );
rederer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( rederer.domElement );


// Create a GLTFLoader - The loader for loading VRM models
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const loader = new GLTFLoader();
// Install a GLTFLoader plugin that enables VRM support

loader.register((parser) => {
  return new VRMLoaderPlugin(parser);
});

let currentVrm = null;

loader.load(
  // URL of the VRM you want to load
  './models/saki_chan_sysadmin.vrm',

    // called when the resource is loaded
  (gltf) => {
      // retrieve a VRM instance from gltf
    const vrm = gltf.userData.vrm;
    
    vrm.scene.position.set(0,0,0);
    // vrm.scene.rotation.y = Math.PI;
    const scale = .75;
    vrm.scene.scale.setScalar( scale );
    
    // scale joints
    for ( const joint of vrm.springBoneManager.joints ) {
      joint.settings.stiffness *= scale;
      joint.settings.hitRadius *= scale;
    }

    //scale colliders
    for ( const collider of vrm.springBoneManager.colliders ) {
      const shape = collider.shape;
      if ( shape instanceof VRMSpringBoneColliderShapeCapsule ) {
        shape.radius *= scale;
        shape.tail.multiplyScalar ( scale );
      } else if ( shape instanceof VRMSpringBoneColliderShapeSphere) {
        shape.radius *= scale;
      }
    }


    const head = vrm.humanoid.getNormalizedBoneNode('head');
    const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
    const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
    const leftElbow = vrm.humanoid.getNormalizedBoneNode('leftLowerArm');
    const rightElbow = vrm.humanoid.getNormalizedBoneNode('rightLowerArm');
    
    head.rotation.z = 0.7;
    leftArm.rotation.z = 1.9;
    rightArm.rotation.z = -1.9;
    leftElbow.rotation.z = 1.7;
    rightElbow.rotation.z = -1.2;
    
    vrm.expressionManager.setValue('happy', 1);
    vrm.expressionManager.setValue('blink', 0);

      // add the loaded vrm to the scene
    scene.add(vrm.scene);
    currentVrm = vrm;

      // deal with vrm features
    console.log(vrm);
  },

    // called while loading is progressing
  (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),

    // called when loading has errors
  (error) => console.error("Error loading VRM ", error),
);

  // ... Perform the render loop ...

const CLock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (currentVrm) {
    currentVrm.update(CLock.getDelta());
  }
  rederer.render(scene, camera)
}

animate();


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rederer.setSize(window.innerWidth, window.innerHeight);
});



