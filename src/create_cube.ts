import * as THREE from 'three'


export function create_cube(): THREE.Mesh {
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200);

    // Create color attributes for each vertex
    const colors: number[] = [];
    const positionAttribute = boxGeometry.getAttribute('position');

    // Set colors for each face (the cube has 6 faces, 2 triangles per face)
    for (let i = 0; i < positionAttribute.count / 3; i++) {
        const h = (1 / 12) * i;
        const color = new THREE.Color().setHSL(h, 0.5, 0.5);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
    }
    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const cubeMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    let cube = new THREE.Mesh(boxGeometry, cubeMaterial);
    cube.position.y = 200;

    return cube;
}
