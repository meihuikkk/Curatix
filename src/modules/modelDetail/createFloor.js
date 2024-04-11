import * as THREE from 'three'

export const CreateFloor = function () {
  this.mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
  );
  this.mesh.rotation.x = -Math.PI / 2;
  this.mesh.receiveShadow = true;
  this.mesh.name = 'Floor'
  this.scene.add(this.mesh);
  const grid = new THREE.GridHelper(2000, 200, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  this.scene.add(grid);
};