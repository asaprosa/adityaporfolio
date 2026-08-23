"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageTransitionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          transition: {
            duration: 0.2,
            delay: 0.2,
            ease: [0.27, 0, 0.51, 1],
          }
        }}
        transition={{
          duration: 0.2,
          ease: [0.27, 0, 0.51, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
