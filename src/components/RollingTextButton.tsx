"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface RollingTextButtonProps extends HTMLMotionProps<"button"> {
  text: string;
  isLoading?: boolean;
}

export function RollingText({ text }: { text: string }) {
  const characters = text.split("");

  return (
    <span className="relative flex overflow-hidden items-center">
      {characters.map((char, index) => (
        <span key={index} className="relative flex">
          <motion.span
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{
              type: "spring",
              duration: 0.8,
              stiffness: 500,
              damping: 60,
              mass: 1,
              bounce: 0.2,
              delay: index * 0.035,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          
          <motion.span
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{
              type: "spring",
              duration: 0.8,
              stiffness: 500,
              damping: 60,
              mass: 1,
              bounce: 0.2,
              delay: index * 0.035,
            }}
            className="absolute left-0 inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function RollingTextButton({ text, isLoading = false, className = "", ...props }: RollingTextButtonProps) {
  return (
    <motion.button
      disabled={isLoading || props.disabled}
      initial="initial"
      whileHover="hover"
      className={`relative flex w-fit items-center justify-center overflow-hidden rounded-full bg-ink px-6 py-3 font-medium text-paper dark:bg-paper dark:text-ink ${className}`}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
          className="flex h-[24px] items-center"
        >
          <Loader2 size={18} />
        </motion.div>
      ) : (
          <RollingText text={text} />
      )}
    </motion.button>
  );
}
