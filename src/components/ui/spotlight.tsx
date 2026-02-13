// "use client";
/**
 * Spotlight — A cursor-following radial gradient spotlight effect for hero sections.
 * Renders an SVG with a motion-blurred ellipse that tracks the mouse position.
 * Uses React.useId() for unique SVG defs — safe with multiple instances per page.
 */
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface SpotlightProps {
  className?: string;
  /** Fill color for the spotlight gradient. Defaults to BNB yellow. */
  fill?: string;
}

export function Spotlight({ className, fill = "#F0B90B" }: SpotlightProps) {
  const uid = useId();
  const filterId = `spotlight-blur${uid}`;
  const gradientId = `spotlight-grad${uid}`;

  const divRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = divRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, prefersReducedMotion]
  );

  useEffect(() => {
    const parent = divRef.current?.parentElement;
    const el = parent ?? document.documentElement;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const spotlightSize = 400;

  const background = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, ${fill}22, transparent 80%)`;

  if (!isMounted) return null;

  return (
    <motion.div
      ref={divRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      style={{ background }}
    >
      <svg
        className="absolute h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fill} stopOpacity="0.15" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.ellipse
          cx={mouseX}
          cy={mouseY}
          rx={spotlightSize}
          ry={spotlightSize * 0.6}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
        />
      </svg>
    </motion.div>
  );
}

export default Spotlight;
