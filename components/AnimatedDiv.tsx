import React from "react";
import { motion } from "motion/react";

interface AnimatedDivProps {
  children: React.ReactNode;
  className?: string;
  childClassNames?: string;
}

const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  children,
  className,
  childClassNames,
}) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants} className={childClassNames}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedDiv;
