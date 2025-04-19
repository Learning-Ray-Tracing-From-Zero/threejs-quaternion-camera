import * as THREE from 'three'


export function create_plane(): THREE.Mesh {
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    planeGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xe0e0e0 });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    return plane;
}
