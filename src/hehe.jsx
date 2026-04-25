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
  const [muted, setMuted] = useState(false);

  const musicRef = useRef(null);
  const sfxRef = useRef(null);

  useEffect(() => {
    const music = new Audio("/multimodal/audio/background.mp3");
    music.loop = true;
    music.volume = 0.5;
    music.play().catch((err) => console.warn("Music blocked:", err));
    musicRef.current = music;

    return () => {
      music.pause();
    };
  }, []);

  // Sync mute to all audio
  useEffect(() => {
    if (musicRef.current) musicRef.current.muted = muted;
    if (sfxRef.current) sfxRef.current.muted = muted;
  }, [muted]);

  // SFX per slide
  useEffect(() => {
    const slide = slides[index];

    if (slide.sfx) {
      const sfx = new Audio(slide.sfx);
      sfx.volume = slide.sfxVolume ?? 1;
      sfx.muted = muted;
      sfx.play().catch((err) => console.warn("SFX blocked:", err));
      sfxRef.current = sfx;
    }

    return () => {
      if (sfxRef.current) {
        sfxRef.current.pause();
        sfxRef.current = null;
      }
    };
  }, [index]);

  // cut all audio on unmount
  useEffect(() => {
    return () => {
      if (musicRef.current) musicRef.current.pause();
      if (sfxRef.current) sfxRef.current.pause();
    };
  }, []);

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
      <button className='mute-button' onClick={() => setMuted((m) => !m)}>
        {muted ? "🔇" : "🔊"}
      </button>

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
          <h1>
            {Array.isArray(slides[index].title)
              ? slides[index].title.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))
              : slides[index].title}
          </h1>
          <p>
            {Array.isArray(slides[index].body)
              ? slides[index].body.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))
              : slides[index].body}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
