// "use client";
/**
 * TextGenerateEffect — Text that appears word-by-word with a staggered fade-in
 * and optional blur filter animation. Triggers on scroll into view.
 */
import React, { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface TextGenerateEffectProps {
  /** The full string to animate word-by-word */
  words: string;
  className?: string;
  /** Apply a blur filter during animation. Default: true */
  filter?: boolean;
  /** Animation duration per word in seconds. Default: 0.5 */
  duration?: number;
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const wordsArray = words.split(" ");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      animate(
        "[data-tge-word]",
        { opacity: 1, filter: "blur(0px)" },
        { duration: 0 }
      );
      return;
    }

    animate(
      "[data-tge-word]",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.08) }
    );
  }, [isInView, animate, filter, duration, prefersReducedMotion]);

  return (
    <div className={cn("font-bold", className)} ref={scope}>
      <div className="mt-4">
        <div className="leading-snug tracking-wide text-neutral-800 dark:text-neutral-100">
          {wordsArray.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              data-tge-word=""
              className="inline-block opacity-0"
              style={{ filter: filter ? "blur(10px)" : "none" }}
            >
              {word}
              {idx < wordsArray.length - 1 && "\u00A0"}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextGenerateEffect;
