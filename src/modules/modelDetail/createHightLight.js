import * as THREE from 'three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

export const CreateHeightLight = function () {
  // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
  this.composer = new EffectComposer(this.renderer)
  // 新建一个场景通道  为了覆盖到原来的场景上
  this.renderPass = new RenderPass(this.scene, this.camera)
  this.composer.addPass(this.renderPass);
  // 物体边缘发光通道
  this.outlinePass = new OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight), this.scene, this.camera)
  this.outlinePass.visibleEdgeColor.set(parseInt(0x00ff00)) // 呼吸显示的颜色
  this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
  this.composer.addPass(this.outlinePass)

  // 解决高亮后环境变暗的问题
  const outputPass = new OutputPass();
  this.composer.addPass(outputPass);

  // 自定义的着色器通道 作为参数
  this.effectFXAA = new ShaderPass(FXAAShader)
  this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  this.composer.addPass(this.effectFXAA)

  console.log(this);
}