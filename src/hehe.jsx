import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = ["Slide One", "Slide Two", "Slide Three"];

const variants = {
  enter: { y: "100%", opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: "-100%", opacity: 0 },
};

export default function Slider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") next();
      if (e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          variants={variants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>{slides[index]}</h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
