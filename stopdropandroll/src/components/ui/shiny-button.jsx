"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },

  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  }
};

export const ShinyButton = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative rounded-lg px-6 py-3 font-medium backdrop-blur-md transition-shadow duration-300 ease-in-out",
        "bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300", // Lighter gradient for better contrast
        "shadow-lg hover:shadow-xl", // Stronger shadows
        className
      )}
      {...animationProps}
      {...props}
    >
      <span
        className="relative block size-full text-sm uppercase tracking-wide text-gray-700 dark:text-white" // Darker text for readability
        style={{
          maskImage:
            "linear-gradient(-75deg, hsl(var(--primary)) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), hsl(var(--primary)) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-gradient-to-r from-gray-4 via-white to-gray-2 p-px" // Subtle light gradient
      ></span>
    </motion.button>
  );
});

ShinyButton.displayName = "ShinyButton";
