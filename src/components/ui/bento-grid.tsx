// "use client";
/**
 * BentoGrid — A responsive CSS grid layout for bento-box style cards.
 * - BentoGrid: Container with grid layout, responsive columns
 * - BentoGridItem: Individual items with hover glow and lift effect
 */
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

/** Bento grid container with responsive column layout */
export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  /** Visual element rendered at the top of the card */
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Individual bento grid item with hover glow and lift effect */
export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl p-4 shadow-none transition-shadow duration-300",
        // Light mode
        "border border-neutral-200 bg-white hover:shadow-[0_0_30px_rgba(240,185,11,0.12)]",
        // Dark mode
        "dark:border-white/[0.08] dark:bg-black dark:hover:shadow-[0_0_30px_rgba(240,185,11,0.08)]",
        className
      )}
    >
      {header && <div className="min-h-[6rem] overflow-hidden rounded-lg">{header}</div>}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon && <div className="mb-2">{icon}</div>}
        {title && (
          <div className="mb-2 font-sans font-bold text-neutral-700 dark:text-neutral-200">
            {title}
          </div>
        )}
        {description && (
          <div className="font-sans text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BentoGrid;
