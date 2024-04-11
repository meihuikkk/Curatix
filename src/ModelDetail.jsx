import React, { useEffect, useState } from "react"
import ModelDetail from "./modules/modelDetail";
import './ModelDetail.css'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Button from '@material-ui/core/Button';
import { useLocation } from 'react-router-dom'
import { store, checkedModalSlice } from "./store";
import * as CANNON from 'cannon-es'
let checkedModalValue = null;
let Modal = null;
export const ModelDetailPage = () => {

  let [isExpand, setIsExpand] = useState(true)
  let [tagIndex, setTagIndex] = useState(1)
  let [modalNo, setModalNo] = useState(1)
  let [test, setTest] = useState({ modal: null })
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery()

  const initModel = () => {
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
    new ModelDetail({ container: document.querySelector('#detail') });
  }
  const panelList = [
    {
      label: 'Rotate',
      value: 1
    },
    {
      label: 'Zoom',
      value: 2
    },
    {
      label: 'Move',
      value: 3
    },
    {
      label: 'Other',
      value: 4
    }
  ]

  useEffect(() => {
    console.log('update view', tagIndex, checkedModalValue);
    const params = query.get('params')
    Modal = new ModelDetail({ container: document.querySelector('#detail'), baseScene: params.split(',') })
    Modal.init()
    Modal.animate()
    checkedModal()
  }, [])

  const checkedModal = () => {
    Modal.renderer.domElement.addEventListener('mousedown', function (event) {
      // console.log(test.modal);
      let mouse = new THREE.Vector2();
      let raycaster = new THREE.Raycaster()
      // Get mouse click location
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, Modal.camera);
      const intersects = raycaster.intersectObjects(Modal.scene.children); // get the model clicked, listed from close to far
      const modal = intersects[0]?.object || null
      const panel = document.querySelector('#ModalPanel')
      console.log('click modal', modal);
      if (modal.parentGroup && modal.parentGroup.name.includes('modal')) {
        Modal.transformControls.attach(modal.parentGroup)
        panel.style.visibility = 'visible'
        checkedModalValue = modal.parentGroup
        Modal.checkedModal = checkedModalValue
      } else {
        // Modal.transformControls.detach()
        panel.style.visibility = 'hidden'
      }
    }, false)
  }

  const expand = (status) => {
    console.log(status);
    setIsExpand(status)
    console.log(isExpand);
  }

  const uploadModal = () => {
    const oInput = document.querySelector('#upload')
    oInput.click()
    oInput.addEventListener('change', function () {
      const fileUrl = URL.createObjectURL(this.files[0])
      // console.log(fileUrl);
      // new OBJLoader().load(fileUrl, (obj) => {
      //   console.log(obj);
      //   obj.name = 'modal'
      //   obj.position.set(30, 0, 0)
      //   Modal.scene.add(obj)
      //   Modal.modelObject.push(obj)
      // })
      // const x = window.innerWidth - 100
      // const y = window.innerHeight - 100
      new GLTFLoader().load(fileUrl, (obj) => {
        obj.scene.name = 'modal'
        // console.log(x,y);
        obj.scene.position.set(0, 20, 20)
        // const mesh = new THREE.Object3D()
        // mesh.add(obj.scene)
        obj.scene.children.forEach(item => {
          item.parentGroup = obj.scene
          item.children.forEach(c => {
            c.parentGroup = obj.scene
          })
        })
        Modal.scene.add(obj.scene)
        // 创建模型的包围盒
        // const boundingBox = new THREE.Box3().setFromObject(obj.scene);
        // const size = boundingBox.getSize(new THREE.Vector3());
        // const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);

        // // 创建模型的物理体
        // const body = new CANNON.Body({
        //   mass: 1, // 质量
        //   position: new CANNON.Vec3(obj.scene.position.x, obj.scene.position.y, obj.scene.position.z), // 位置
        //   shape: new CANNON.Box(halfExtents) // 形状
        // });
        // Modal.world.addBody(body)
        // setModalNo(++modalNo);
        console.log('obj.scene ------->', obj.scene);
        // Modal.modelObject.push(obj.scene)
      })
    })
  }

  const handleTag = (e) => {
    let index = e.target.attributes['data-index']?.value
    if (index) {
      if (index === tagIndex) return;
      setTagIndex(index++)
    }
  }

  // const huanhan = () => {
  //   const str = 'yyyyy\nnnn'
  //   return (<pre>{str}</pre>)
  // }
  const removeModal = () => {
    Modal.remove()
  }
  const copyModal = () => {
    Modal.clone()
  }

  const xzForm = () => (<div>
    <div>
      Rotate around X：<input type="number" defaultValue={0} max={360} min={-360} name="angleX" />&nbsp;&nbsp;degree
    </div>
    <div>
      Rotate around Y：<input type="number" defaultValue={0} max={360} min={-360} name="angleY" />&nbsp;&nbsp;degree
    </div>
    <div>
      Rotate around Z：<input type="number" defaultValue={0} max={360} min={-360} name="angleZ" />&nbsp;&nbsp;degree
    </div>
  </div>)
  const sfForm = () => (<div>
    <div>
      X-axis：<input type="number" defaultValue={1} step="0.01" max={100} min={0} name="scaleX" />&nbsp;&nbsp;ratio
    </div>
    <div>
      Y-axis：<input type="number" defaultValue={1} step="0.01" max={100} min={0} name="scaleY" />&nbsp;&nbsp;ratio
    </div>
    <div>
      Z-axis：<input type="number" defaultValue={1} step="0.01" max={100} min={0} name="scaleZ" />&nbsp;&nbsp;ratio
    </div>
  </div>)
  const ydForm = () => (<div>
    <div>
      X-axis：<input type="number" defaultValue={0} name="moveX" />&nbsp;&nbsp;
    </div>
    <div>
      Y-axis：<input type="number" defaultValue={0} name="moveY" />&nbsp;&nbsp;
    </div>
    <div>
      Z-axis：<input type="number" defaultValue={0} name="moveZ" />&nbsp;&nbsp;
    </div>
  </div>)
  const otherForm = () => (<div>
    <div>
      <Button onClick={() => removeModal()} style={({ backgroundColor: 'red', color: '#fff' })}>Delete</Button>
    </div>
    <div>
      <Button onClick={() => copyModal()} style={({ backgroundColor: '#fff' })}>Clone</Button>
    </div>
  </div>)

  const renderForm = () => {
    switch (tagIndex) {
      case 1:
        return xzForm;
        break;
      case 2:
        return sfForm;
        break;
      case 3:
        return ydForm;
        break;
      case 4:
        return otherForm;
        break;
    }
  }

  const handleModal = (e) => {
    e.preventDefault()
    const oForm = document.querySelector('#ModalPanelForm')
    const data = new FormData(oForm)
    console.log(Modal);
    switch (tagIndex) {
      case 1:
        const degX = data.get('angleX')
        const degY = data.get('angleY')
        const degZ = data.get('angleZ')
        Modal.rotate(degX, "X");
        Modal.rotate(degY, "Y");
        Modal.rotate(degZ, "Z");
        oForm.reset()
        break;
      case 2:
        const scaleX = data.get('scaleX')
        const scaleY = data.get('scaleY')
        const scaleZ = data.get('scaleZ')
        Modal.zoom(scaleX, scaleY, scaleZ)
        oForm.reset()
        break;
      case 3:
        const moveX = data.get('moveX')
        const moveY = data.get('moveY')
        const moveZ = data.get('moveZ')
        Modal.move({ x: moveX, y: moveY, z: moveZ })
        oForm.reset()
        break;
    }
  }

  const exportModal = () => {
    Modal.exportModal()
  }

  return (
    <div id="detail">
      <div className="modal-operate-bar" style={(!isExpand ? { animation: 'unexpand 1s both' } : { animation: 'expand 1s both' })}>
        {test.value}{test.key}
        <div onClick={() => expand(false)} className="modal-operate-bar_btn" style={({ margin: '0 auto 0 0' })}>Close</div>
        <div onClick={() => uploadModal()} className="modal-operate-bar_btn">Upload Model</div>
        <div onClick={() => exportModal()} className="modal-operate-bar_btn">Export</div>
      </div>
      <div id="ModalPanel" className="modal-panel">
        <div onClick={(event) => handleTag(event)} className="function-tag-list">
          {
            panelList.map(item => {
              if (item.value === tagIndex) {
                return (
                  <div key={item.value} data-index={item.value} className="function-tag-list_item function-tag-list_item--active">{item.label}</div>
                )
              }
              return (
                <div key={item.value} data-index={item.value} className="function-tag-list_item">{item.label}</div>
              )
            })
          }

        </div>
        <form onSubmit={(event) => handleModal(event)} id="ModalPanelForm">
          {
            renderForm()()
          }

          <div className="submit-btn">
            <Button type="submit" style={({ background: '#fff' })}>Confirm</Button>
          </div>
          {/* <label htmlFor="angle">
            旋转角度:
            
          </label> */}
        </form>
      </div>
      <div onClick={() => expand(true)} style={(isExpand ? { display: 'none' } : { animation: 'large 1s 1s both' })} className="modal-operate-bar--unexpand">Expand</div>
      <input accept=".gltf,.glb" id="upload" type="file" style={({ visibility: 'hidden', width: 0, height: 0, position: 'fixed' })}></input>
    </div>
  )
}