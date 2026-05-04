import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../data/projects.js'; // Ensure these paths are correct
import socialsData from '../data/socials.js';
import ThreeDScene from './ThreeDScene';

function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Instructions for users */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <div>Click to enable mouse look</div>
        <div>WASD or Arrow Keys to move</div>
        <div>ESC to exit mouse look</div>
      </div>

      {/* FPS Room Scene - Replace with your room model path */}
      <ThreeDScene 
        mode="fps"
        url="/models/TestRoom.glb" // Temporary - replace with your room model
        roomBounds={{ minX: -2, maxX: 2.25, minZ: -2, maxZ: 1 }} // 4m x 8m room
        showBounds={true} // Set to false once you have your room model
        movementSpeed={4}
        lookSpeed={0.002}
        eyeHeight={1.33}
      />
    </div>
  );
}

export default Home;
