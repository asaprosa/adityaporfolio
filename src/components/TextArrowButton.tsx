"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
import { RollingText } from "@/components/RollingTextButton";

interface TextArrowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export function TextArrowButton({ children, className = "", onClick, as = "button", href, target, rel }: TextArrowButtonProps) {
  const content = (
    <>
      <span className="relative z-10 text-ink dark:text-paper font-medium">
        {typeof children === "string" ? <RollingText text={children} /> : children}
      </span>
      
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line bg-paper dark:bg-ink2">
        <motion.div
          className="absolute bottom-0 left-0 h-full w-full origin-center rounded-full bg-ink dark:bg-paper"
          variants={{
            initial: { scale: 0 },
            hover: { scale: 4 },
          }}
          transition={{ duration: 0.8, bounce: 0.2, type: "spring" }}
        />
        
        <motion.div
          className="absolute z-10 text-ink dark:text-paper"
          variants={{
            initial: { x: 0, y: 0 },
            hover: { x: "120%", y: "-120%" },
          }}
          transition={{ duration: 0.8, bounce: 0.2, type: "spring" }}
        >
          <ArrowUpRight size={18} />
        </motion.div>
        
        <motion.div
          className="absolute z-10 text-paper dark:text-ink"
          variants={{
            initial: { x: "-120%", y: "120%" },
            hover: { x: 0, y: 0 },
          }}
          transition={{ duration: 0.8, bounce: 0.2, type: "spring" }}
        >
          <ArrowUpRight size={18} />
        </motion.div>
      </div>
    </>
  );

  const containerClass = `group relative flex w-fit items-center gap-3 overflow-hidden rounded-full ${className}`;

  if (as === "a" || href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={containerClass}
        initial="initial"
        whileHover="hover"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={containerClass}
      initial="initial"
      whileHover="hover"
    >
      {content}
    </motion.button>
  );
}
