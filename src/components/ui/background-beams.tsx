// "use client";
/**
 * BackgroundBeams — Animated SVG background beams/rays emanating from a central point.
 * Multiple beam paths with gradient strokes and staggered opacity animations.
 * Uses React.useId() for unique SVG defs — safe with multiple instances per page.
 */
import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface BackgroundBeamsProps {
  className?: string;
}

const beamPaths = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
  "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
  "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
  "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
  "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
  "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
  "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
  "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
  "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
  "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
  "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
  "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
  "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
  "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
  "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
  "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
];

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const uid = useId();
  const gradientId = `beam-gradient${uid}`;
  const gradientDimId = `beam-gradient-dim${uid}`;

  const prefersReducedMotion = usePrefersReducedMotion();

  // Stable per-beam durations so they don't change on re-render
  const beamDurations = useMemo(
    () => beamPaths.map(() => 4 + Math.random() * 3),
    []
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0B90B" stopOpacity="0" />
            <stop offset="50%" stopColor="#F0B90B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F0B90B" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={gradientDimId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F0B90B" stopOpacity="0" />
            <stop offset="50%" stopColor="#F0B90B" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F0B90B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base beams with staggered opacity */}
        {beamPaths.map((d, i) => (
          <motion.path
            key={`beam-${i}`}
            d={d}
            stroke={`url(#${gradientDimId})`}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 0.15 }
                : { pathLength: 1, opacity: [0, 0.4, 0.15, 0.4, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: 2,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: beamDurations[i],
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    },
                  }
            }
          />
        ))}

        {/* Brighter accent beams */}
        {beamPaths.slice(0, 6).map((d, i) => (
          <motion.path
            key={`bright-beam-${i}`}
            d={d}
            stroke={`url(#${gradientId})`}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 0.1 }
                : { pathLength: [0, 1], opacity: [0, 0.5, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: 3,
                      delay: 2 + i * 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 3,
                      delay: 2 + i * 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    },
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

export default BackgroundBeams;
