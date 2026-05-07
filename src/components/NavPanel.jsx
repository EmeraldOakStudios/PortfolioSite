import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// A navigation panel — click it to travel to another room route.
function NavPanel({
  position = [0, 1.5, 0],
  rotation = [0, 0, 0],
  label = 'Next Room \u2192',
  modalOpen = false,
  onNavigate = () => {}
}) {
  const meshRef = useRef();
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const centerScreen = new THREE.Vector2(0, 0);

  useFrame(() => {
    if (!meshRef.current) return;
    raycaster.current.setFromCamera(centerScreen, camera);
    const hit = raycaster.current.intersectObject(meshRef.current).length > 0;
    meshRef.current.material.color.set(hit ? '#88ccff' : '#2266aa');
  });

  const handleCanvasClick = () => {
    if (modalOpen) return;
    if (document.pointerLockElement !== gl.domElement) return;
    raycaster.current.setFromCamera(centerScreen, camera);
    const hit = raycaster.current.intersectObject(meshRef.current).length > 0;
    if (hit) onNavigate();
  };

  useEffect(() => {
    gl.domElement.addEventListener('click', handleCanvasClick);
    return () => gl.domElement.removeEventListener('click', handleCanvasClick);
  }, [gl, onNavigate, modalOpen]);

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#2266aa" side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

export default NavPanel;
