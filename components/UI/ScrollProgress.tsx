import React from 'react';
import { motion, useScroll } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-brand-gold origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};