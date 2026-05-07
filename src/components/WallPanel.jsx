import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// A 2x4 flat panel on a wall. Highlights and shows text when the crosshair is aimed at it. Clickable to open modal.
function WallPanel({ 
  position = [0, 1.5, -3], 
  rotation = [0, 0, 0],
  title = 'Panel Title',
  body = 'Look at me to read\nthis content.',
  modalOpen = false,
  onPanelClick = () => {} // Callback when panel is clicked
}) {
  const meshRef = useRef();
  const titleRef = useRef();
  const bodyRef = useRef();
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const centerScreen = new THREE.Vector2(0, 0);
  let isLookedAt = false;

  useFrame(() => {
    if (!meshRef.current) return;

    raycaster.current.setFromCamera(centerScreen, camera);
    const hit = raycaster.current.intersectObject(meshRef.current).length > 0;
    isLookedAt = hit;

    // Highlight panel and toggle text visibility
    meshRef.current.material.color.set(hit ? '#cccccc' : '#888888');
    if (titleRef.current) titleRef.current.visible = hit;
    if (bodyRef.current) bodyRef.current.visible = hit;
  });

  // Handle click on the panel
  const handleCanvasClick = () => {
    if (modalOpen) return;
    if (document.pointerLockElement !== gl.domElement) return;

    raycaster.current.setFromCamera(centerScreen, camera);
    const hit = raycaster.current.intersectObject(meshRef.current).length > 0;
    if (hit) {
      onPanelClick({ title, body });
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener('click', handleCanvasClick);
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [gl, onPanelClick, title, body, modalOpen]);

  return (
    <group position={position} rotation={rotation}>
      {/* Panel face */}
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#888888" side={THREE.DoubleSide} />
      </mesh>

      {/* Title — slightly in front of the panel so it doesn't z-fight */}
      <Text
        ref={titleRef}
        visible={false}
        position={[0, 0.5, 0.01]}
        fontSize={0.18}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        font={undefined}
      >
        {title}
      </Text>

      {/* Body text */}
      <Text
        ref={bodyRef}
        visible={false}
        position={[0, 0, 0.01]}
        fontSize={0.11}
        color="#222222"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
        lineHeight={1.4}
        font={undefined}
      >
        {body}
      </Text>
    </group>
  );
}

export default WallPanel;
