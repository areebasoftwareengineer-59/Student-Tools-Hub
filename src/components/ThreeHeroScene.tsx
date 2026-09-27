import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export function ThreeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const { theme } = useTheme();

  // Keep references to update colors dynamically without recreating the whole WebGL context
  const lightsRef = useRef<{
    keyLight?: THREE.DirectionalLight;
    rimLight?: THREE.DirectionalLight;
    coreLight?: THREE.PointLight;
  }>({});
  const meshesRef = useRef<{
    coreMesh?: THREE.Mesh;
    ring1Mesh?: THREE.Mesh;
    ring2Mesh?: THREE.Mesh;
    ring3Mesh?: THREE.Mesh;
    particlesMesh?: THREE.Points;
  }>({});

  // Dynamic color update when theme changes
  useEffect(() => {
    const { keyLight, rimLight, coreLight } = lightsRef.current;
    const { coreMesh, ring1Mesh, ring2Mesh, ring3Mesh, particlesMesh } = meshesRef.current;

    if (keyLight) keyLight.color.setHex(theme.accentHex);
    if (rimLight) rimLight.color.setHex(theme.secondaryHex);
    if (coreLight) coreLight.color.setHex(theme.coreEmissiveHex);

    if (coreMesh && coreMesh.material instanceof THREE.MeshStandardMaterial) {
      coreMesh.material.color.setHex(theme.coreOrbHex);
      coreMesh.material.emissive.setHex(theme.coreEmissiveHex);
    }
    if (ring1Mesh && ring1Mesh.material instanceof THREE.MeshStandardMaterial) {
      ring1Mesh.material.color.setHex(theme.secondaryHex);
      ring1Mesh.material.emissive.setHex(theme.secondaryHex);
    }
    if (ring2Mesh && ring2Mesh.material instanceof THREE.MeshStandardMaterial) {
      ring2Mesh.material.color.setHex(theme.accentHex);
      ring2Mesh.material.emissive.setHex(theme.accentHex);
    }
    if (ring3Mesh && ring3Mesh.material instanceof THREE.MeshStandardMaterial) {
      ring3Mesh.material.color.setHex(theme.rimHex);
      ring3Mesh.material.emissive.setHex(theme.rimHex);
    }
    if (particlesMesh && particlesMesh.material instanceof THREE.PointsMaterial) {
      particlesMesh.material.color.setHex(theme.accentHex);
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 7.5;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const canvas = renderer.domElement;
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        setHasWebGL(false);
      };
      const handleContextRestored = () => {
        setHasWebGL(true);
      };
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

      // Root pivot group that tilts with mouse
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(theme.accentHex, 3.2);
      keyLight.position.set(4, 5, 5);
      scene.add(keyLight);
      lightsRef.current.keyLight = keyLight;

      const rimLight = new THREE.DirectionalLight(theme.secondaryHex, 2.5);
      rimLight.position.set(-5, -4, -3);
      scene.add(rimLight);
      lightsRef.current.rimLight = rimLight;

      // Glow point light directly inside the center core orb
      const coreLight = new THREE.PointLight(theme.coreEmissiveHex, 4.5, 12, 1.2);
      coreLight.position.set(0, 0, 0);
      mainGroup.add(coreLight);
      lightsRef.current.coreLight = coreLight;

      // 1. Central Luminous Sphere (The glowing magenta/neon core from the screenshot)
      const coreGeo = new THREE.SphereGeometry(0.75, isMobile ? 32 : 48, isMobile ? 32 : 48);
      const coreMat = new THREE.MeshStandardMaterial({
        color: theme.coreOrbHex,
        emissive: theme.coreEmissiveHex,
        emissiveIntensity: 1.6,
        roughness: 0.15,
        metalness: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);
      meshesRef.current.coreMesh = coreMesh;

      // 2. Sculpted Concentric Metallic Ring 1 (Inner Torus)
      // Nested closely around the glowing core
      const ring1Geo = new THREE.TorusGeometry(1.65, 0.42, isMobile ? 24 : 36, isMobile ? 48 : 80);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: theme.secondaryHex,
        emissive: theme.secondaryHex,
        emissiveIntensity: 0.15,
        roughness: 0.24,
        metalness: 0.9,
      });
      const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1Mesh.rotation.x = Math.PI * 0.18;
      ring1Mesh.rotation.y = Math.PI * 0.22;
      mainGroup.add(ring1Mesh);
      meshesRef.current.ring1Mesh = ring1Mesh;

      // 3. Sculpted Concentric Metallic Ring 2 (Middle Torus)
      const ring2Geo = new THREE.TorusGeometry(2.45, 0.32, isMobile ? 20 : 32, isMobile ? 48 : 80);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: theme.accentHex,
        emissive: theme.accentHex,
        emissiveIntensity: 0.12,
        roughness: 0.28,
        metalness: 0.88,
      });
      const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2Mesh.rotation.x = -Math.PI * 0.14;
      ring2Mesh.rotation.y = -Math.PI * 0.18;
      mainGroup.add(ring2Mesh);
      meshesRef.current.ring2Mesh = ring2Mesh;

      // 4. Concentric Ring 3 (Outer Halo Ring)
      const ring3Geo = new THREE.TorusGeometry(3.1, 0.07, 16, isMobile ? 48 : 80);
      const ring3Mat = new THREE.MeshStandardMaterial({
        color: theme.rimHex,
        emissive: theme.rimHex,
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.92,
      });
      const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3Mesh.rotation.x = Math.PI * 0.45;
      mainGroup.add(ring3Mesh);
      meshesRef.current.ring3Mesh = ring3Mesh;

      // 5. Floating Academic Sprite Badges (GPA 4.0, CGPA, %, A+, 75% ✓, Calendar, Calculator)
      const badgeLabels = [
        { text: 'GPA 4.0', color: '#c084fc', radius: 3.4, angle: 0, speed: 0.35 },
        { text: 'CGPA', color: '#f43f5e', radius: 3.3, angle: (Math.PI * 2) / 7, speed: 0.3 },
        { text: '% 100', color: '#38bdf8', radius: 3.5, angle: (Math.PI * 4) / 7, speed: 0.38 },
        { text: 'Grade A+', color: '#fbbf24', radius: 3.2, angle: (Math.PI * 6) / 7, speed: 0.32 },
        { text: '75% ✓', color: '#34d399', radius: 3.4, angle: (Math.PI * 8) / 7, speed: 0.36 },
        { text: 'Calendar', color: '#e879f9', radius: 3.3, angle: (Math.PI * 10) / 7, speed: 0.28 },
        { text: 'Calculator', color: '#60a5fa', radius: 3.1, angle: (Math.PI * 12) / 7, speed: 0.34 },
      ];

      const createTextTexture = (label: string, strokeColor: string) => {
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 256;
        textCanvas.height = 100;
        const ctx = textCanvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = 'rgba(15, 8, 28, 0.88)';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.roundRect(10, 10, 236, 80, 22);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 128, 50);

        const texture = new THREE.CanvasTexture(textCanvas);
        texture.needsUpdate = true;
        return texture;
      };

      const badgeMeshes: { sprite: THREE.Sprite; item: typeof badgeLabels[0]; initialAngle: number }[] = [];

      badgeLabels.forEach((item, index) => {
        const texture = createTextTexture(item.text, item.color);
        if (!texture) return;

        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        });

        const sprite = new THREE.Sprite(spriteMat);
        const scaleFactor = isMobile ? 0.65 : 0.8;
        sprite.scale.set(1.2 * scaleFactor, 0.5 * scaleFactor, 1);

        mainGroup.add(sprite);
        badgeMeshes.push({
          sprite,
          item,
          initialAngle: item.angle + index * 0.15,
        });
      });

      // 6. Ambient Stardust Particles
      const particleCount = isMobile ? 60 : 160;
      const particlesGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const rad = 2.2 + Math.random() * 3.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        posArray[i] = rad * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = rad * Math.cos(phi);
      }

      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMat = new THREE.PointsMaterial({
        size: isMobile ? 0.03 : 0.045,
        color: theme.accentHex,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(particlesGeo, particlesMat);
      mainGroup.add(particleSystem);
      meshesRef.current.particlesMesh = particleSystem;

      // Mouse Parallax tracking
      let targetRotX = 0;
      let targetRotY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const { innerWidth, innerHeight } = window;
        const mouseX = (e.clientX / innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / innerHeight - 0.5) * 2;
        targetRotY = mouseX * 0.4;
        targetRotX = mouseY * 0.3;
      };

      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (!prefersReducedMotion) {
          // Smooth lerp towards mouse position
          mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
          mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

          // Intrinsic rotations of sculpted rings
          coreMesh.rotation.y = elapsedTime * 0.2;
          coreMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;

          // Subtle pulsing intensity on the glowing center orb
          coreMat.emissiveIntensity = 1.4 + Math.sin(elapsedTime * 2.5) * 0.25;
          coreLight.intensity = 4.0 + Math.sin(elapsedTime * 2.5) * 0.8;

          ring1Mesh.rotation.z = elapsedTime * 0.15;
          ring2Mesh.rotation.z = -elapsedTime * 0.12;
          ring3Mesh.rotation.z = elapsedTime * 0.08;

          particleSystem.rotation.y = elapsedTime * 0.025;

          // Orbit badges smoothly around concentric structure
          badgeMeshes.forEach((badge) => {
            const currentAngle = badge.initialAngle + elapsedTime * (badge.item.speed * 0.35);
            const radius = badge.item.radius;
            badge.sprite.position.x = Math.cos(currentAngle) * radius;
            badge.sprite.position.y = Math.sin(currentAngle * 1.4) * 0.7;
            badge.sprite.position.z = Math.sin(currentAngle) * radius;
          });
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        cancelAnimationFrame(animationFrameId);

        coreGeo.dispose();
        coreMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        ring3Geo.dispose();
        ring3Mat.dispose();
        particlesGeo.dispose();
        particlesMat.dispose();
        renderer.dispose();

        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-purple-500/20 bg-purple-950/20 backdrop-blur-xl flex items-center justify-center relative animate-pulse">
          <div className="w-40 h-40 rounded-full border border-pink-400/30 flex items-center justify-center">
            <span className="text-purple-300 text-xl font-bold font-mono">GPA 4.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] lg:min-h-[520px] pointer-events-none select-none relative"
      aria-hidden="true"
    />
  );
}
