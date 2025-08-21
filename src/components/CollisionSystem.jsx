import React from 'react';
import { Box } from '@react-three/drei';

// Visual representation of room boundaries (optional - for debugging)
function CollisionSystem({ 
  roomBounds = { minX: -2, maxX: 2, minZ: -4, maxZ: 4 },
  showBounds = false // Set to true to see invisible walls
}) {
  if (!showBounds) return null;

  const roomWidth = roomBounds.maxX - roomBounds.minX; // 4m
  const roomDepth = roomBounds.maxZ - roomBounds.minZ; // 8m
  const centerX = (roomBounds.maxX + roomBounds.minX) / 2;
  const centerZ = (roomBounds.maxZ + roomBounds.minZ) / 2;

  return (
    <group>
      {/* Invisible boundary walls - only visible if showBounds is true */}
      
      {/* Front wall */}
      <Box 
        position={[centerX, 1.5, roomBounds.maxZ]} 
        args={[roomWidth, 3, 0.1]} 
        visible={showBounds}
      >
        <meshStandardMaterial color="red" transparent opacity={0.3} />
      </Box>
      
      {/* Back wall */}
      <Box 
        position={[centerX, 1.5, roomBounds.minZ]} 
        args={[roomWidth, 3, 0.1]} 
        visible={showBounds}
      >
        <meshStandardMaterial color="red" transparent opacity={0.3} />
      </Box>
      
      {/* Left wall */}
      <Box 
        position={[roomBounds.minX, 1.5, centerZ]} 
        args={[0.1, 3, roomDepth]} 
        visible={showBounds}
      >
        <meshStandardMaterial color="red" transparent opacity={0.3} />
      </Box>
      
      {/* Right wall */}
      <Box 
        position={[roomBounds.maxX, 1.5, centerZ]} 
        args={[0.1, 3, roomDepth]} 
        visible={showBounds}
      >
        <meshStandardMaterial color="red" transparent opacity={0.3} />
      </Box>
      
      {/* Floor boundary indicator */}
      <Box 
        position={[centerX, 0.01, centerZ]} 
        args={[roomWidth, 0.02, roomDepth]} 
        visible={showBounds}
      >
        <meshStandardMaterial color="blue" transparent opacity={0.2} />
      </Box>
    </group>
  );
}

export default CollisionSystem;