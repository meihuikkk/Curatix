import * as THREE from "three";
import { InitCameraAndScene } from "./initCameraAndScene";
import { CreateFloor } from "./createFloor";
import { CreateControls } from "./createControls";
import { CreateHeightLight } from './createHightLight'
import { InitModel } from "./initModel";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import * as CANNON from "cannon-es";

class ModelDetail {
  constructor({ modelPath, baseScene = [], resourcePath, panel, infoPanel, progress, getModalInfo, container }) {
    this.camera = {};
    this.scene = {};
    this.renderer = {};
    this.controls = {};
    this.trackballControls = {};
    this.checkedModal = {};
    this.modelObject = [];
    this.composer = {};
    this.renderPass = {};
    this.outlinePass = {};
    this.effectFXAA = {};
    // this.skeleton = {};
    // this.mixer = {};
    this.modelPath = modelPath;
    this.resourcePath = resourcePath;
    this.panel = panel; // '1' 渲染Panel 其他情况均不渲染
    this.infoPanel = infoPanel; // 规则同上
    this.container = container;
    this.clock = new THREE.Clock();
    this.progress = progress;
    this.getModalInfo = getModalInfo;
    this.modalType = '';
    this.dirLight = {};
    this.dragControls = {}
    this.dirLightBack = {};
    this.transformControls = {};
    this.mesh = {};
    this.baseScene = baseScene
    this.world = {};
    this.initSceneCamera = InitCameraAndScene;
    this.createGround = CreateFloor;
    // this.distinguishFileType = distinguishFileType;
    this.webGLControls = CreateControls;
    this.heightLight = CreateHeightLight;
    this.InitModel = InitModel

    // this.fbxLoadModel = fbxLoadModel;
    // this.glbLoadModel = glbLoadModel;
    // this.loaderFor3DM = loaderFor3DM;
    // this.loaderFor3DS = loaderFor3DS;
    // this.stlLoader = stlLoader;
    // this.objLoader = objLoader;
    // this.plyLoader = plyLoader;
    // this.publicLoadCallback = publicLoadCallback;

    // this.setScaleToFitSize = setScaleToFitSize;
    // this.getFitScaleValue = getFitScaleValue;
    // this.setPositionToFitGrid = setPositionToFitGrid;
    // this.setAxisDirection = setAxisDirection;

    // this.collectModalInfo = collectModalInfo;

    // this.createPanel = createPanel;
    // this.loadProgress = loadProgress;

    // this.notFound = notFound;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);

    // this.init();
    // this.animate();
  }

  // createOperate(){
  //   const div = document.createElement('div')
  //   div.innerHTML = `<div>测试</div>`

  // }
  setCheckedModal(checkedModal) {
    this.checkedModal = checkedModal
  }

  async init() {
    console.log('class modal init--------------');
    // this.container = document.createElement("div");
    // document.body.appendChild(this.container);

    // 初始化场景和相机
    this.initSceneCamera();

    // 地板
    this.createGround();

    // 加载模型
    // this.distinguishFileType();
    // this.InitModel(['http://localhost:3000/models/G1/G1_B7.glb', 'http://localhost:3000/models/G1/G1_B8.glb'], [])
    this.InitModel(this.baseScene, [])

    this.webGLControls();

    this.heightLight();

    // this.world = new CANNON.World()

    // const floorShape = new CANNON.Plane();
    // const floorBody = new CANNON.Body({
    //   // 设置为0时保证地面不动
    //   mass: 0,
    //   shape: floorShape,
    //   // 需要与threejs中地面位置同步
    //   position: new CANNON.Vec3(0, 0, 0),
    // });
    // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    // this.world.addBody(floorBody);

    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    if (this.mixer && this.mixer.update) this.mixer.update(delta);
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    // this.world.step(1 / 60, delta, 3)
    // this.checkedModal = this.checkedModal
    // this.trackballControls.update()
    // console.log(this);
  }

  /**
   * 
   * @param {*} deg 
   * @param {('X'|'Y'|'Z')} type 
   */
  rotate(deg = 1, type = 'X') {
    // console.log(this.checkedModal,deg);
    console.log(this.checkedModal);
    switch (type) {
      case 'X':
        this.checkedModal.rotateX(deg)
        break;
      case 'Y':
        this.checkedModal.rotateY(deg)
        break;
      case 'Z':
        this.checkedModal.rotateZ(deg)
        break;
    }

  }

  exportModal() {
    const exporter = new GLTFExporter();
    const that = this;
    const Floor = this.scene.getObjectByName('Floor')
    if(Floor){
      this.scene.remove(Floor)
    }
    // const floorIndex = this.scene.children.findIndex(item => item.name === 'Floor')
    // const scene = Object.assign({},this.scene)
    // scene.children.splice(floorIndex,1)
    // console.log(scene);
    exporter.parse(this.scene, function (result) {
      const output = JSON.stringify(result, null, 2);
      that.downloadJSON(output, 'scene.gltf');
    });
  }
  downloadJSON(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  /**
   * 缩放
   * @param {*} x 
   * @param {*} y 
   * @param {*} z 
   */
  zoom(x, y, z) {
    console.log(this.checkedModal);
    this.checkedModal.scale.set(x, y, z)
  }
  /**
   * 平移
   */
  move({ x, y, z }) {
    console.log(this.checkedModal);
    this.checkedModal.translateX(x)
    this.checkedModal.translateY(y)
    this.checkedModal.translateZ(z)
  }
  /**
   * 删除
   */
  remove() {
    const isPass = window.confirm('删除后模型会消失!请谨慎操作')
    if (isPass) {
      this.transformControls.detach()
      this.scene.remove(this.checkedModal)
      console.log('remove --->', this.checkedModal, this.scene);
    }
  }
  /**
   * clone modal
   */
  clone() {
    const modal = this.checkedModal.clone()
    const x = this.checkedModal.position.x
    const y = this.checkedModal.position.y
    const z = this.checkedModal.position.z
    modal.position.set(x, y + 6, z)
    modal.children.forEach(item => {
      item.parentGroup = modal
      item.children.forEach(c => {
        c.parentGroup = modal
      })
    })
    this.scene.add(modal)
    // console.log();
    console.log('clone --->', modal);
  }
}

// const progress = (percent) => {
//   const loadingContainer = document.querySelector(".loading-container");
//   if (percent === 'NaN%') return;
//   if (percent === "100.0%") {
//     loadingContainer.style.display = "none";
//   } else {
//     loadingContainer.style.display = "block";
//     const loadingBar = document.querySelector(".loading-bar");
//     const loadingTips = document.querySelector(".loading-tips");
//     loadingBar.style.width = percent;
//     loadingTips.innerHTML = percent;
//   }
// };

// const getModalInfo = (info, isInfoPanel) => {
//   if (isInfoPanel === '1') {
//     const modalInfo = document.querySelector('.modalInfo');
//     modalInfo.style.display = 'block';
//     const {
//       Animation,
//       Ext,
//       FileSize,
//       HasUv,
//       Texture,
//       Triangles,
//       Vertices,
//     } = info;
//     const animation = document.querySelector('.Animation');
//     const extContainer = document.querySelector('.Ext');
//     const fileSize = document.querySelector('.FileSize');
//     const hasUV = document.querySelector('.HasUv');
//     const textureContainer = document.querySelector('.Texture');
//     const triangles = document.querySelector('.Triangles');
//     const verticesContainer = document.querySelector('.Vertices');
//     animation.innerHTML = Animation || '0';
//     extContainer.innerHTML = Ext;
//     fileSize.innerHTML = FileSize ? FileSize + 'MB' : '';
//     hasUV.innerHTML = HasUv ? '有' : '无';
//     textureContainer.innerHTML = Texture || '0';
//     triangles.innerHTML = Triangles || '0';
//     verticesContainer.innerHTML = Vertices || '0';
//     window.sessionStorage.setItem('modal-info', JSON.stringify(info));
//   }
// };

// const onload = function () {
//   const { search } = window.location;
//   let modelPath;
//   let resourcePath;
//   let panel = '0'; // 是否渲染 Panel
//   let infoPanel = '0'; // 是否渲染 模型信息面板
//   if (search) {
//     const params = search.substring(1);
//     const res = parse(params);
//     modelPath = res.path;
//     resourcePath = res.source;
//     panel = res.panel;
//     infoPanel = res.infoPanel;
//   }
//   // ?path=https://test-dam-feiyuantu.oss-cn-beijing.aliyuncs.com/vdam-php/three-dimensional/111129/D10451612143391333.FBX&panel=1&infoPanel=1
//   new Simple3D({ modelPath, resourcePath, panel, infoPanel, progress, getModalInfo });
// };

// window.onload = onload;

export default ModelDetail
