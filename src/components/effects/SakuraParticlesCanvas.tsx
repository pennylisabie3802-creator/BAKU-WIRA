/**
 * BAKUWIRA: Sakura Petals & Magical Particles Canvas
 * High-performance 60fps canvas renderer featuring:
 * - Fluttering 3D cherry blossom petals with bezier geometry and wind physics
 * - Rising enchanted golden dust motes & twinkling 4-point mana stars
 * - Interactive wind gust response to mouse movement
 */

import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  swingAngle: number;
  swingSpeed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  alphaDelta: number;
  maxAlpha: number;
  sparkleType: 'star' | 'orb' | 'spark';
  hue: number;
}

export const SakuraParticlesCanvas: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Read graphics quality setting for mobile & performance scaling
    const quality = typeof window !== 'undefined' ? (localStorage.getItem('bakuwira_graphics_quality') || 'high') : 'high';
    const PETAL_COUNT = quality === 'low' ? 16 : quality === 'medium' ? 30 : 45;
    const PARTICLE_COUNT = quality === 'low' ? 14 : quality === 'medium' ? 26 : 45;

    const petals: Petal[] = [];
    const petalColors = [
      'rgba(255, 214, 224, ',
      'rgba(255, 183, 197, ',
      'rgba(255, 192, 203, ',
      'rgba(255, 226, 236, ',
    ];

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 10 + Math.random() * 14,
        speedY: 0.8 + Math.random() * 1.4,
        speedX: 0.5 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.02 + Math.random() * 0.03,
        opacity: 0.7 + Math.random() * 0.3,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }

    // Initialize Magical Golden Particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: width * 0.2 + Math.random() * (width * 0.6), // Focused near center characters & castle
        y: height * 0.3 + Math.random() * (height * 0.6),
        size: 2 + Math.random() * 3.5,
        speedY: -(0.3 + Math.random() * 0.8), // Floating upwards
        speedX: (Math.random() - 0.5) * 0.6,
        alpha: Math.random(),
        alphaDelta: 0.01 + Math.random() * 0.02,
        maxAlpha: 0.6 + Math.random() * 0.4,
        sparkleType: Math.random() > 0.4 ? 'star' : 'orb',
        hue: 45 + Math.random() * 15, // Golden yellow hue
      });
    }

    // Helper: Draw single realistic sakura petal path
    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flip: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(Math.cos(flip), 1); // 3D flip illusion

      context.beginPath();
      context.moveTo(0, -size);
      // Right petal curve
      context.bezierCurveTo(size * 0.65, -size * 0.6, size * 0.8, size * 0.4, 0, size);
      // Left petal curve
      context.bezierCurveTo(-size * 0.8, size * 0.4, -size * 0.65, -size * 0.6, 0, -size);
      context.closePath();

      // Soft gradient fill
      const grad = context.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, `${color}${alpha * 0.95})`);
      grad.addColorStop(0.6, `${color}${alpha * 0.8})`);
      grad.addColorStop(1, `rgba(255, 240, 245, ${alpha * 0.9})`);

      context.fillStyle = grad;
      context.fill();

      // Subtle center vein
      context.beginPath();
      context.moveTo(0, -size * 0.6);
      context.lineTo(0, size * 0.5);
      context.strokeStyle = `rgba(255, 150, 180, ${alpha * 0.4})`;
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    };

    // Helper: Draw 4-pointed twinkling magical star
    const drawSparkleStar = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number,
      hue: number
    ) => {
      context.save();
      context.translate(x, y);

      // Outer glow
      context.shadowBlur = 8;
      context.shadowColor = `hsla(${hue}, 100%, 75%, ${alpha})`;

      // 4-point star
      context.beginPath();
      for (let i = 0; i < 4; i++) {
        context.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        context.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25));
      }
      context.closePath();
      context.fillStyle = `hsla(${hue}, 100%, 85%, ${alpha})`;
      context.fill();

      // Center bright core
      context.beginPath();
      context.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.fill();

      context.restore();
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Magical Particles (back/mid layer)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += p.alphaDelta;

        if (p.alpha >= p.maxAlpha || p.alpha <= 0.05) {
          p.alphaDelta = -p.alphaDelta;
        }

        // Reset if offscreen top
        if (p.y < -20) {
          p.y = height + 10;
          p.x = width * 0.15 + Math.random() * (width * 0.7);
          p.alpha = 0.1;
        }

        if (p.sparkleType === 'star') {
          drawSparkleStar(ctx, p.x, p.y, p.size * 2.2, p.alpha, p.hue);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${p.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = `hsla(${p.hue}, 95%, 75%, ${p.alpha})`;
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Draw Sakura Petals (front layer with wind sway)
      const mouse = mouseRef.current;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.swingAngle += p.swingSpeed;
        const swingOffset = Math.sin(p.swingAngle) * 1.5;

        p.y += p.speedY;
        p.x += p.speedX + swingOffset;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Interactive mouse wind push
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 2;
          }
        }

        // Loop petals to top/left when they drift offscreen
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) {
          p.x = -20;
        } else if (p.x < -25) {
          p.x = width + 20;
        }

        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.flip, p.color, p.opacity);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};
