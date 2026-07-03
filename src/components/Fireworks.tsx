import { useEffect, useRef } from "react";

interface FireworksProps {
  triggerCount: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
}

// Scribe-themed cozy palette for fireworks
const COZY_COLORS = [
  "#D97757", // Terracotta
  "#E0D4C1", // Warm Cream
  "#8F9E8B", // Sage Green
  "#F3C086", // Soft Amber
  "#D9A0A0", // Dusky Rose
  "#E5C3B2", // Peach Dust
];

export default function Fireworks({ triggerCount }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Generate bursts when triggerCount increments
  useEffect(() => {
    if (triggerCount === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create 3-5 distinct bursts across the screen
    const burstCount = 3 + Math.floor(Math.random() * 3);
    
    for (let b = 0; b < burstCount; b++) {
      setTimeout(() => {
        const x = window.innerWidth * (0.2 + Math.random() * 0.6);
        const y = window.innerHeight * (0.25 + Math.random() * 0.4);
        
        createBurst(x, y);
      }, b * 180); // Staggered delays for a natural feel
    }
  }, [triggerCount]);

  const createBurst = (x: number, y: number) => {
    const particleCount = 45 + Math.floor(Math.random() * 20);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      const color = COZY_COLORS[Math.floor(Math.random() * COZY_COLORS.length)];
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // Slight upward push
        color,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        size: 1.5 + Math.random() * 2,
        gravity: 0.05,
      });
    }

    particlesRef.current = [...particlesRef.current, ...particles];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeParticles: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          // Add a subtle warmth glow
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
          
          activeParticles.push(p);
        }
      }

      particlesRef.current = activeParticles;
      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
}
