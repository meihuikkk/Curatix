import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import './Zoning.css'
import layoutPic from './assets/images/gallery_layout.jpg'
import layoutG3Pic from './assets/images/gallery_g3_layout.png'
// import layoutPic from './assets/images/gallery_layout.jpg'
import { RectBox } from './components/rect';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// // import { nodeFrame } from 'three/examples/jsm/renderers/webgl-legacy/nodes/WebGLNodes';
// import { MeshBasicNodeMaterial, NodeFrame as nodeFrame, color, mix, positionLocal, vec4 } from 'three/examples/jsm/nodes/Nodes';
// const Zoning = () => {

//   const domRef = useRef()

//   useEffect(() => {
//     let container, stats;
//     let camera, scene, renderer;

//     async function init() {

//       const { innerWidth, innerHeight } = window;

//       container = document.createElement('div');
//       domRef.current.appendChild(container);

//       // CAMERA

//       camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 10000);
//       camera.position.set(700, 200, - 500);

//       // SCENE

//       scene = new THREE.Scene();

//       // LIGHTS

//       const light = new THREE.DirectionalLight(0xd5deff);
//       light.position.x = 300;
//       light.position.y = 250;
//       light.position.z = - 500;
//       scene.add(light);

//       // SKYDOME

//       //  const topColor = new THREE.Color().copy(light.color);
//       //   const bottomColor = new THREE.Color(0xffffff);
//       //   const offset = 400;
//       //   const exponent = 0.6;

//       //   const h = positionLocal.add(offset).normalize().y;

//       //   const skyMat = new MeshBasicNodeMaterial();
//       //   skyMat.colorNode = vec4(mix(color(bottomColor), color(topColor), h.max(0.0).pow(exponent)), 1.0);
//       //   skyMat.side = THREE.BackSide;

//       //   const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 15), skyMat);
//       //   scene.add(sky);

//       // RENDERER

//       renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setPixelRatio(window.devicePixelRatio);
//       renderer.setSize(innerWidth, innerHeight);
//       container.appendChild(renderer.domElement);

//       // CONTROLS

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.maxPolarAngle = 0.9 * Math.PI / 2;
//       controls.enableZoom = false;

//       // STATS

//       stats = new Stats();
//       container.appendChild(stats.dom);

//       // MODEL

//       // const loader = new THREE.ObjectLoader();
//       // const object = await loader.loadAsync('models/json/lightmap/lightmap.json');
//       // scene.add(object);

//       //

//       window.addEventListener('resize', onWindowResize);

//     }

//     function onWindowResize() {

//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();

//       renderer.setSize(window.innerWidth, window.innerHeight);

//     }

//     //

//     function animate() {

//       requestAnimationFrame(animate);

//       // nodeFrame.update();

//       renderer.render(scene, camera);
//       // stats.update();

//     }

//     init().then(animate);
//   }, [])

//   return (
//     <div ref={domRef}>
//     </div>
//   );
// };

// export default Zoning;
const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    minHeight: '60px'
  }
}));

export const ZoningPage = () => {

  const classes = useStyles();
  let [checkedModel, setCheckedModel] = useState([])
  let [checkedModelTwo, setCheckedModelTwo] = useState([])
  const router = useNavigate()
  const checkedRect = (key) => {
    let isHave = checkedModel.findIndex((item) => item === key)
    if (isHave === -1) {
      checkedModel.push(key)
    } else {
      checkedModel.splice(isHave, 1)
    }
    setCheckedModel([...checkedModel])
  }
  const checkedRectTwo = (key) => {
    let isHave = checkedModelTwo.findIndex((item) => item === key)
    if (isHave === -1) {
      checkedModelTwo.push(key)
    } else {
      checkedModelTwo.splice(isHave, 1)
    }
    setCheckedModelTwo([...checkedModelTwo])
  }
  const confirmOne = () => {
    let str = checkedModel.length > 0 ? checkedModel.join(',') : ''
    router(`/modelDetail?params=${str}`)
  }
  const confirmTwo = () => {
    let str = checkedModelTwo.length > 0 ? checkedModelTwo.join(',') : ''
    router(`/modelDetail?params=${str}`)
  }
  return (
    <div className='container'>
      <div className={classes.toolbar} />
      <div className="img-wrapper" >
        <img src={layoutPic} alt="" style={({ width: '1000px', height: '700px' })} />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 202, left: 318 })} value="b7" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 202, left: 433 })} value="b8" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 202, left: 549 })} value="b9" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 309, left: 202 })} value="c6" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 309, left: 318 })} value="c7" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 309, left: 433 })} value="c8" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 309, left: 549 })} value="c9" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 421, left: 202 })} value="d6" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 421, left: 318 })} value="d7" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 421, left: 433 })} value="d8" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 421, left: 549 })} value="d9" />

        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 312, left: 724 })} width={139} value="c11" />
        <RectBox currentValue={checkedModel} checked={(value) => checkedRect(value)} position={({ top: 418, left: 724 })} width={139} value="d11" />
      </div>
      <div className="operate-bar">
        <Button onClick={() => confirmOne()} variant='contained'>CONFIRM</Button>
      </div>
      <div className="img-wrapper" style={({ marginTop: '20px' })}>
        <img src={layoutG3Pic} alt="" style={({ width: '1000px', height: '700px' })} />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 168, left: 174 })} width={166} height={164} value="c1" />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 168, left: 396 })} width={166} height={164} value="b1" />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 168, left: 609 })} width={166} height={164} value="a1" />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 396, left: 174 })} width={166} height={164} value="c2" />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 396, left: 396 })} width={166} height={164} value="b2" />
        <RectBox currentValue={checkedModelTwo} checked={(value) => checkedRectTwo(value)} position={({ top: 396, left: 609 })} width={166} height={164} value="a2" />
      </div>
      <div className="operate-bar">
        <Button onClick={() => confirmTwo()} variant='contained'>CONFIRM</Button>
      </div>
    </div>
  )
}
