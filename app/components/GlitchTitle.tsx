"use client";

import { motion } from "framer-motion";

interface GlitchTitleProps {
  text: string;
  className?: string;
}

export default function GlitchTitle({ text, className = "" }: GlitchTitleProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.h1
        className="text-white relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {text}
      </motion.h1>
      <motion.h1
        className="absolute top-0 left-0 text-rose-500 opacity-70 z-0 pointer-events-none"
        animate={{
          x: [-2, 2, -1, 0, 1],
          y: [1, -1, 0, 2, -1],
          opacity: [0.3, 0.7, 0.5, 0.8, 0.4]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          ease: "linear"
        }}
      >
        {text}
      </motion.h1>
      <motion.h1
        className="absolute top-0 left-0 text-cyan-500 opacity-70 z-0 pointer-events-none"
        animate={{
          x: [2, -2, 1, 0, -1],
          y: [-1, 1, 0, -2, 1],
          opacity: [0.3, 0.7, 0.5, 0.8, 0.4]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.3,
          ease: "linear"
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
}
