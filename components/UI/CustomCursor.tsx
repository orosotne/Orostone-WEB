import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements or their children
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';

      setCursorVariant(isClickable ? 'hover' : 'default');
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', checkHover);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', checkHover);
    };
  }, []);

  const variants = {
    default: {
      height: 12,
      width: 12,
      x: mousePos.x - 6,
      y: mousePos.y - 6,
      backgroundColor: "#ECD488",
      opacity: 1,
    },
    hover: {
      height: 64,
      width: 64,
      x: mousePos.x - 32,
      y: mousePos.y - 32,
      backgroundColor: "#ECD488",
      opacity: 0.3, // Semi-transparent for overlay effect
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        mass: 0.5
      }}
    />
  );
};