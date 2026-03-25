import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Preload } from '@react-three/drei';

function Model({ mousePosition, scrollY }) {
  // Try to load the model. If it's missing, you may see an error in the console.
  const { nodes, materials } = useGLTF('/models/stock_market.glb', true);
  const group = useRef();

  useFrame((state) => {
    // Animate rotation based on mouse position and scroll
    const targetX = mousePosition.x * 2;
    const targetY = mousePosition.y * 2 + scrollY * 0.005;

    // Smoothly interpolate current rotation towards target rotation
    group.current.rotation.x += (targetY - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
  });

  // Use the downloaded Flamingo.glb as a placeholder
  return (
    <group ref={group} scale={0.03} position={[0, -1, 0]}>
      <primitive object={nodes.Scene || nodes.mesh_0} />
    </group>
  );
}

// Fallback component if glTF load fails
function FallbackChart({ mousePosition, scrollY }) {
  const group = useRef();
  
  useFrame((state) => {
    const targetX = mousePosition.x * 0.5;
    const targetY = mousePosition.y * 0.5 + scrollY * 0.002;

    group.current.rotation.x += (targetY - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
  });

  return (
    <group ref={group} position={[3, -1, -5]}>
      {/* 3D Bar chart representation representing stock market */}
      <mesh position={[-2, 1, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#ef4444" opacity={0.8} transparent />
      </mesh>
      <mesh position={[-1, 1.5, 0]}>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#22c55e" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.5, 5, 0.5]} />
        <meshStandardMaterial color="#22c55e" opacity={0.8} transparent />
      </mesh>
      <mesh position={[1, 1.5, 0]}>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#ef4444" opacity={0.8} transparent />
      </mesh>
      <mesh position={[2, 3, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#22c55e" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

export default function Scene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <Environment preset="city" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <React.Suspense fallback={<FallbackChart mousePosition={mousePosition} scrollY={scrollY} />}>
          <Model mousePosition={mousePosition} scrollY={scrollY} />
        </React.Suspense>
      </Float>
      <Preload all />
    </Canvas>
  );
}
