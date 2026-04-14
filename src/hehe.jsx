import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import slides from "./data/slides.json";
import "./index.css";

const variants = {
  enter: (dir) => ({ y: `${100 * dir}%`, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir) => ({ y: `${-100 * dir}%`, opacity: 0 }),
};

export default function Slider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // music
  const musicRef = useRef(null);
  const sfxRef = useRef(null);

  useEffect(() => {
    const slide = slides[index];

    // Play SFX once on slide enter
    if (slide.sfx) {
      sfxRef.current = new Audio(slide.sfx);
      sfxRef.current.play();
    }

    // Handle music - stop previous, start new
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }

    if (slide.music) {
      musicRef.current = new Audio(slide.music);
      musicRef.current.loop = true;
      musicRef.current.play();
    }

    // Cleanup when slide changes
    return () => {
      if (sfxRef.current) {
        sfxRef.current.pause();
        sfxRef.current = null;
      }
    };
  }, [index]);

  // cut music
  useEffect(() => {
    return () => {
      if (musicRef.current) musicRef.current.pause();
      if (sfxRef.current) sfxRef.current.pause();
    };
  }, []);

  // sliding

  const next = () => {
    setDirection(1);
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  };

  const prev = () => {
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  };

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
    <div className='slide-container'>
      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`slide ${slides[index].style}`}
        >
          <h1>{slides[index].title}</h1>
          <p>{slides[index].body}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
