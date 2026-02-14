import * as React from "react";
import { motion, type Variants } from "framer-motion";

interface AnimateIconProps {
  children: React.ReactElement;
  /** Animate on hover (scale + rotate sparkle effect) */
  animateOnHover?: boolean;
  /** Animate on click/tap */
  animateOnTap?: boolean;
  /** Continuously animate (pulse/breathe) */
  animatePulse?: boolean;
  /** Spin continuously */
  animateSpin?: boolean;
  /** Custom animation variant name */
  animation?: "sparkle" | "bounce" | "shake" | "pulse" | "spin";
  className?: string;
}

const sparkleVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: [1, 1.2, 0.9, 1.1, 1],
    rotate: [0, -10, 10, -5, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  tap: {
    scale: 0.85,
    transition: { duration: 0.1 },
  },
};

const bounceVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: [0, -4, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const shakeVariants: Variants = {
  initial: { x: 0 },
  hover: {
    x: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.4 },
  },
};

const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const spinVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
};

const variantMap = {
  sparkle: sparkleVariants,
  bounce: bounceVariants,
  shake: shakeVariants,
  pulse: pulseVariants,
  spin: spinVariants,
};

export const AnimateIcon: React.FC<AnimateIconProps> = ({
  children,
  animateOnHover = false,
  animateOnTap = false,
  animatePulse = false,
  animateSpin = false,
  animation = "sparkle",
  className,
}) => {
  const resolvedAnimation = animateSpin ? "spin" : animatePulse ? "pulse" : animation;
  const variants = variantMap[resolvedAnimation];

  const isContinuous = animatePulse || animateSpin;

  return (
    <motion.span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      variants={variants}
      initial="initial"
      animate={isContinuous ? "animate" : "initial"}
      whileHover={animateOnHover ? "hover" : undefined}
      whileTap={animateOnTap ? "tap" : undefined}
    >
      {children}
    </motion.span>
  );
};
