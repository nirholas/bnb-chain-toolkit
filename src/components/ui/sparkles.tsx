// "use client";
/**
 * SparklesCore — Canvas-based floating particle sparkle animation.
 * Renders shimmering particles with configurable density, size, and color.
 */
import { useEffect, useId, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeDirection: number;
}

export interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}

export function SparklesCore({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = "#FFFFFF",
  speed = 1,
}: SparklesCoreProps) {
  const uid = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const createParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speedX: (Math.random() - 0.5) * speed * 0.3,
      speedY: (Math.random() - 0.5) * speed * 0.3,
      opacity: Math.random(),
      fadeDirection: Math.random() > 0.5 ? 1 : -1,
    }),
    [maxSize, minSize, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        // Reinitialize particles on resize
        particlesRef.current = Array.from({ length: particleDensity }, () =>
          createParticle(width, height)
        );
      }
    });

    resizeObserver.observe(canvas.parentElement ?? canvas);

    if (prefersReducedMotion) {
      // Static sparkles for reduced motion
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      particlesRef.current = Array.from({ length: particleDensity }, () =>
        createParticle(width, height)
      );
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity * 0.6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return () => resizeObserver.disconnect();
    }

    function animate() {
      if (!ctx || !canvas) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeDirection * 0.008;

        if (p.opacity <= 0.1) p.fadeDirection = 1;
        if (p.opacity >= 1) p.fadeDirection = -1;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [particleDensity, particleColor, createParticle, prefersReducedMotion]);

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={{ background }}
    >
      <canvas
        ref={canvasRef}
        id={id ?? uid}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}

/** Alias used by the barrel export in index.ts */
export { SparklesCore as Sparkles };
export type { SparklesCoreProps as SparklesProps };

export default SparklesCore;
