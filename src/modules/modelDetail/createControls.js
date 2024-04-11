import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export const CreateControls = function () {    
  
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.outputEncoding = THREE.sRGBEncoding;
  // 阴影
  this.renderer.shadowMap.enabled = true;
  // 阴影 -- 清晰
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  this.container.appendChild(this.renderer.domElement);

  const that = this;
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.transformControls = new TransformControls(this.camera, this.renderer.domElement)
  this.transformControls.addEventListener('change', () => {
    console.log('模型拖动')
  })
  this.transformControls.addEventListener('dragging-changed', function (event) {
    that.controls.enabled = !event.value
    console.log(that);
    // this.physics.setEnabled(!event.value)
  })
  this.scene.add(this.transformControls)
  this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement)
  this.dragControls = new DragControls(this.modelObject,this.camera, this.renderer.domElement)
  this.dragControls.addEventListener('dragstart', function () {
    that.controls.enabled = false
    // console.log(that.controls);
  })
  this.dragControls.addEventListener('dragend', function () {
    that.controls.enabled = true
    
    // console.log(that.controls);
  })
  // target为相机运动时，所注视的坐标
  // this.controls.target.set(0, 100, 0);
  // 相机平移
  this.controls.enablePan = false;
  this.controls.update();
  // 相机旋转时开启阻尼
  this.controls.enableDamping = true;
  // 阻尼系数
  // this.controls.dampingFactor = 1;
  this.controls.autoRotate = false;
};

