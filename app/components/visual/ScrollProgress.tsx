import { motion, useScroll, useSpring } from "framer-motion";

/** Thin vermilion rule that fills as the visitor reads down the page. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-primary"
    />
  );
};

export default ScrollProgress;
