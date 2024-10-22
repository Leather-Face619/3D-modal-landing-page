import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import gsap from 'gsap';

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 0.1, 100 );


// Renderer
const renderer = new THREE.WebGLRenderer({canvas : document.querySelector('#canvas'),antialias:true,alpha:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

// Postprocessing
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const rgbShiftPass = new ShaderPass( RGBShiftShader );
// Modify the amount of RGB shift
rgbShiftPass.uniforms[ 'amount' ].value = 0.012; // Adjust this value 

// You can also change the angle of the shift
rgbShiftPass.uniforms[ 'angle' ].value = Math.PI / 4; // Adjust this value (in radians)

composer.addPass( rgbShiftPass );

// Function to handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight)
}
let model;


// Load GLTF model
const loader = new GLTFLoader();
loader.load('./3D-model/DamagedHelmet.gltf', (gltf) => {
    // gltf.scene.position.y = 0.1; // Move the model slightly up
   model = gltf.scene
    scene.add(model);
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
    console.log('An error happened');
});
window.addEventListener('mousemove', (event) => {
 if(model){
    const rotationX = (event.clientX / window.innerWidth - .5) * (Math.PI *.4)
    const rotationY = (event.clientY / window.innerHeight - .5) * (Math.PI *.4)
    gsap.to(model.rotation, {
        y: rotationX, 
        x: rotationY, 
        duration: 0.8
    });
 }
});
window.addEventListener('resize', onWindowResize);




// Load HDRI
const hdriLoader = new RGBELoader();
hdriLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_sunset_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
});

camera.position.z = 5;


function animate() {
    // Render
    
    composer.render(); // Update controls
   
} 
animate()