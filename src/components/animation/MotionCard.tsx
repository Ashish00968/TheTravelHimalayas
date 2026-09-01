"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
}

export function MotionCard({ children, className }: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
