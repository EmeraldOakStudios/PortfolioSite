import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function FPSControls({ 
  movementSpeed = 5, 
  lookSpeed = 0.002, 
  eyeHeight = 1.67,
  roomBounds = { minX: -2, maxX: 2, minZ: -4, maxZ: 4 } // 4m x 8m room centered at origin
}) {
  const { camera, gl } = useThree();
  
  // Movement state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  
  // Mouse look state
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const pointerLocked = useRef(false);

  // Initialize camera position and controls
  useEffect(() => {
    // Set initial camera position (center of room at eye height)
    camera.position.set(0, eyeHeight, 0);
    camera.rotation.order = 'YXZ';

    camera.rotation.set(0, 0, 0);
    
    // Keyboard event handlers
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.right = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.left = true;
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.right = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.left = false;
          break;
      }
    };

    // Mouse look handlers
    const handleMouseMove = (event) => {
      if (!pointerLocked.current) return;

      const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * lookSpeed;
      euler.current.x -= movementY * lookSpeed;
      
      // Limit vertical look (prevent looking too far up/down)
      euler.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.current.x));
      
      camera.quaternion.setFromEuler(euler.current);
    };

    // Pointer lock handlers
    const handleClick = () => {
      if (!pointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === gl.domElement) {
        pointerLocked.current = true;
      } else {
        pointerLocked.current = false;
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl, lookSpeed, eyeHeight]);

  // Movement and collision detection
  useFrame((state, delta) => {
    if (!pointerLocked.current) return;

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // Calculate movement direction based on camera orientation
    camera.getWorldDirection(direction);
    
    // Get right vector for strafe movement
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // Apply movement based on pressed keys
    if (keys.current.forward) {
      velocity.add(direction);
    }
    if (keys.current.backward) {
      velocity.sub(direction);
    }
    if (keys.current.right) {
      velocity.add(right);
    }
    if (keys.current.left) {
      velocity.sub(right);
    }

    // Normalize and apply speed
    if (velocity.length() > 0) {
      velocity.normalize();
      velocity.multiplyScalar(movementSpeed * delta);
      
      // Calculate new position
      const newPosition = camera.position.clone().add(velocity);
      
      // Apply collision detection (keep within room bounds)
      newPosition.x = Math.max(roomBounds.minX, Math.min(roomBounds.maxX, newPosition.x));
      newPosition.z = Math.max(roomBounds.minZ, Math.min(roomBounds.maxZ, newPosition.z));
      
      // Keep camera at eye height (no vertical movement for now)
      newPosition.y = eyeHeight;
      
      // Apply the bounded position
      camera.position.copy(newPosition);
    }
  });

  return null; // This component doesn't render anything
}

export default FPSControls;