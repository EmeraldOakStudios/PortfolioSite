import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Rail-based controls: scroll moves camera along X axis, mouse look rotates freely.
function FPSControls({
  lookSpeed = 0.002,
  eyeHeight = 1.67,
  railMin = -10,     // minimum X position along the rail
  railMax = 10,      // maximum X position along the rail
  scrollSpeed = 0.02, // units moved per scroll delta unit
  modalOpen = false   // disable scroll when modal is open
}) {
  const { camera, gl } = useThree();

  // Target X position on the rail (updated by scroll)
  const targetX = useRef(0);
  const modalOpenRef = useRef(modalOpen);

  // Mouse look state
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const pointerLocked = useRef(false);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  useEffect(() => {
    // Place camera at rail start, eye height, facing forward along Z
    camera.position.set(targetX.current, eyeHeight, 0);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, 0, 0);
    euler.current.set(0, 0, 0);

    // Scroll drives movement along the X rail
    const handleWheel = (event) => {
      if (modalOpenRef.current) return; // Don't scroll if modal is open
      event.preventDefault();
      targetX.current = Math.max(
        railMin,
        Math.min(railMax, targetX.current + event.deltaY * scrollSpeed)
      );
    };

    // Mouse look (only active when pointer is locked)
    const handleMouseMove = (event) => {
      if (!pointerLocked.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * lookSpeed;
      euler.current.x -= movementY * lookSpeed;
      euler.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    // Click canvas to lock pointer for mouse look
    const handleClick = () => {
      if (!pointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);
    // Use the canvas element for wheel so it only fires when over the 3D view
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl, lookSpeed, eyeHeight, railMin, railMax, scrollSpeed]);

  // Each frame: smoothly lerp camera to target X, lock Z and Y
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX.current, 0.1);
    camera.position.y = eyeHeight;
    camera.position.z = 0;
  });

  return null;
}

export default FPSControls;