import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../data/projects.js'; // Ensure these paths are correct
import socialsData from '../data/socials.js';
import ThreeDScene from './ThreeDScene';

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });

  useEffect(() => {
    if (modalOpen && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [modalOpen]);

  const handlePanelClick = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    // Re-enter pointer lock from the same user click that closes the modal.
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.requestPointerLock) {
      canvas.requestPointerLock();
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* Crosshair — fixed centre of screen */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        pointerEvents: 'none',
        zIndex: 1000,
      }} />

      {/* Instructions */}
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
        <div>Scroll to move along the corridor</div>
        <div>Click to enable mouse look</div>
        <div>ESC to exit mouse look</div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          pointerEvents: 'auto'
        }}>
          {/* Modal content box */}
          <div style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '40px',
            borderRadius: '10px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            border: '2px solid #444',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
          }}>
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '0',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Modal title */}
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '28px' }}>
              {modalContent.title}
            </h2>

            {/* Modal body */}
            <p style={{ fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {modalContent.body}
            </p>
          </div>
        </div>
      )}

      {/* Rail Scene */}
      <ThreeDScene
        mode="fps"
        url="/models/TestRoom.glb"
        railMin={-2}
        railMax={1}
        scrollSpeed={0.005}
        lookSpeed={0.002}
        eyeHeight={1.67}
        modalOpen={modalOpen}
        onPanelClick={handlePanelClick}
      />
    </div>
  );
}

export default Home;
