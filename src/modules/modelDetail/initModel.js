import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { baseUrl } from '../../config/index'
export const InitModel = function (paths = [], resourcePath = []) {
  const baseModals = [
    {
      key: 'b7',
      value: baseUrl + '/G1/G1_B7.glb'
    },
    {
      key: 'b8',
      value: baseUrl + '/G1/G1_B8.glb'
    },
    {
      key: 'b9',
      value: baseUrl + '/G1/G1_B9.glb'
    },
    {
      key: 'c6',
      value: baseUrl + '/G1/G1_C6.glb'
    },
    {
      key: 'c7',
      value: baseUrl + '/G1/G1_C7.glb'
    },
    {
      key: 'c8',
      value: baseUrl + '/G1/G1_C8.glb'
    },
    {
      key: 'c9',
      value: baseUrl + '/G1/G1_C9.glb'
    },
    {
      key: 'd6',
      value: baseUrl + '/G1/G1_D6.glb'
    },
    {
      key: 'd7',
      value: baseUrl + '/G1/G1_D7.glb'
    },
    {
      key: 'd8',
      value: baseUrl + '/G1/G1_D8.glb'
    },
    {
      key: 'd9',
      value: baseUrl + '/G1/G1_D9.glb'
    },
    {
      key: 'c11',
      value: baseUrl + '/G2/C11.glb'
    },
    {
      key: 'd11',
      value: baseUrl + '/G2/D11.glb'
    },
    {
      key: 'a1',
      value: baseUrl + '/G3/G3_A1.glb'
    },
    {
      key: 'a2',
      value: baseUrl + '/G3/G3_A2.glb'
    },
    {
      key: 'b1',
      value: baseUrl + '/G3/G3_B1.glb'
    },
    {
      key: 'b2',
      value: baseUrl + '/G3/G3_B2.glb'
    },
    {
      key: 'c1',
      value: baseUrl + '/G3/G3_C1.glb'
    },
    {
      key: 'c2',
      value: baseUrl + '/G3/G3_C2.glb'
    }
  ]
  const modals = baseModals.filter(item => paths.includes(item.key))
  const that = this;
  modals.forEach(item => {
    new GLTFLoader().load(item.value, function (glb) {
      const model = glb.scene
      model.name = 'base_modal'
      switch (item.key) {
        case 'b7':
          model.position.set(12, 0, 0)
          break;
        case 'b8':
          model.position.set(21.7, 0, 0)
          break;
        case 'b9':
          model.position.set(30.8, 0, 0)
          break;
        case 'c6':
          model.position.set(2.3, 0, 9)
          break;
        case 'c7':
          model.position.set(12, 0, 9)
          break;
        case 'c8':
          model.position.set(21.7, 0, 9)
          break;
        case 'c9':
          model.position.set(30.8, 0, 9)
          break;
        case 'd6':
          model.position.set(2.3, 0, 18)
          break;
        case 'd7':
          model.position.set(12, 0, 18)
          break;
        case 'd8':
          model.position.set(21.7, 0, 18)
          break;
        case 'd9':
          model.position.set(30.9, 0, 18.3)
          break;
        case 'd11':
          model.position.set(43, 0, 8)
          break;
        case 'c11':
          model.position.set(43, 0, 8)
          break;
        case 'a1':
          model.position.set(0, 0, 2.7)
          break;
        case 'a2':
          model.position.set(10, 0, 3.2)
          break;
        case 'b1':
          model.position.set(0, 0, 12)
          break;
        case 'b2':
          model.position.set(10, 0, 12.5)
          break;
        case 'c1':
          model.position.set(0, 0, 22.3)
          break;
        case 'c2':
          model.position.set(10, 0, 21.8)
          break;
      }
      that.scene.add(model)
    })
  })

  // for (let index = 0; index < paths.length; index++) {
  //   const path = paths[index];

  // }
};