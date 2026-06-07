"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
}

export function MotionCard({ children }: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}
