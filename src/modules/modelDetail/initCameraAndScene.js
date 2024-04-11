import * as THREE from 'three'
export const InitCameraAndScene = function () {
  this.camera = new THREE.PerspectiveCamera(
    50, // 相机距离
    window.innerWidth / window.innerHeight,
    1,
    20000
    // 1000
  );
  this.camera.position.set(25, 20, 50);
  this.camera.lookAt(0, 0, 0);

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0xa0a0a0);
  this.scene.fog = new THREE.Fog(0xffffff, 200, 2000);

  // 前景灯
  this.dirLight = new THREE.DirectionalLight(0xffffff);
  this.dirLight.position.set(10, 200, 200);
  this.dirLight.intensity = 1;
  this.dirLight.castShadow = true;
  this.dirLight.shadow.camera.top = 500;
  this.dirLight.shadow.camera.bottom = -500;
  this.dirLight.shadow.camera.left = -500;
  this.dirLight.shadow.camera.right = 500;
  this.dirLight.shadow.camera.near = 0.5;
  this.dirLight.shadow.camera.far = 1000;
  this.scene.add(this.dirLight);

  // 后景灯
  this.dirLightBack = new THREE.DirectionalLight(0xffffff);
  this.dirLightBack.position.set(10, 200, -200);
  this.dirLightBack.intensity = 1;
  this.scene.add(this.dirLightBack);

  //显示三维坐标系
  const axis = new THREE.AxesHelper(300);
  this.scene.add(axis);
};