// "use client";
/**
 * HoverEffect — Animated card grid where cards expand/glow on hover.
 * Shows a background highlight that follows the hovered card.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HoverEffectItem {
  title: string;
  description: string;
  link: string;
}

export interface HoverEffectProps {
  items: HoverEffectItem[];
  className?: string;
}

export function HoverEffect({ items, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={`${item.title}-${idx}`}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-[#F0B90B]/[0.08] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden border border-transparent",
        "bg-white dark:bg-black",
        "border-neutral-200 dark:border-white/[0.08]",
        "group-hover:border-neutral-300 dark:group-hover:border-[#F0B90B]/[0.2]",
        "relative z-20 transition-colors duration-300",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h4
      className={cn(
        "text-neutral-800 dark:text-neutral-100 font-bold tracking-wide mt-2",
        className
      )}
    >
      {children}
    </h4>
  );
}

function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-4 text-neutral-500 dark:text-neutral-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
}

export default HoverEffect;
