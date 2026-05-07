import React from 'react';
import { m, useScroll } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-brand-gold origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};