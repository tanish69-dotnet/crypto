import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scrollRef = { y: 0, smooth: 0 };
    const onScroll = () => { scrollRef.y = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    // Very subtle fog to blend particles smoothly into the dark background
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // ─── MINIMALIST DUST / STARS ─────────────────────────────────
    const COUNT = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Spread across a wide area
      positions[i * 3]     = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      // Drift speeds
      speeds[i] = 0.02 + Math.random() * 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft, small grey/white points
    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1.2,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ─── VERY SUBTLE SLOW ROTATING MESH (Optional Depth) ──────────
    const wireGeo = new THREE.IcosahedronGeometry(80, 1);
    const wireMat = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.03 
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // ─── ANIMATION LOOP ───────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth scroll
      scrollRef.smooth += (scrollRef.y - scrollRef.smooth) * 0.06;
      const s = scrollRef.smooth;

      // Slow drift for particles
      const posAttr = particles.geometry.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = posAttr.getY(i) + speeds[i];
        // Reset to bottom if it goes too high
        if (y > 200) y = -200;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      // Gentle rotation for the particle field
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.01;
      
      // Parallax effect on scroll
      particles.position.y = s * 0.03;

      // Slow rotation for ambient wireframe
      wireMesh.rotation.x = t * 0.03;
      wireMesh.rotation.y = t * 0.04;
      wireMesh.position.y = s * 0.02;

      // Very slight camera shifts
      camera.position.y = -s * 0.01;
      camera.rotation.x = s * 0.0001;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.8 }}
    />
  );
}
