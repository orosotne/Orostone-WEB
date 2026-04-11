import React from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  variant?: 'h1' | 'h2' | 'p';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = "",
  delay = 0,
  variant = 'p'
}) => {
  // Rozdelenie textu na slová
  const words = children.split(" ");

  // Varian pre kontajner (orchestrátor)
  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
    }),
  };

  // Varian pre jednotlivé slová (vysunutie z masky)
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.5
      },
    },
    hidden: {
      opacity: 0,
      y: "100%",
    },
  };

  const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : 'p';

  return (
    <Tag className={`flex flex-wrap ${className}`}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="flex flex-wrap"
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden mr-[0.25em] align-bottom pb-[0.15em] -mb-[0.15em]">
            <motion.span variants={child} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </Tag>
  );
};