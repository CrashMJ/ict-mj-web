import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

import img1 from '../assets/Banner1.jpg';
import img2 from '../assets/Banner2.jpg';
import img3 from '../assets/Banner3.jpeg';

const slides = [
  {
    image: img1,
    title: 'Learn from the Best',
    subtitle: 'Top ICT teachers in Sri Lanka',
    buttonText: 'Join Now',
    buttonLink: '#join',
  },
  {
    image: img2,
    title: 'Modern Teaching Methods',
    subtitle: 'Smart learning for smart students',
    buttonText: 'Get Started',
    buttonLink: '#get-started',
  },
  {
    image: img3,
    title: 'Join Our ICT Revolution',
    subtitle: 'Be a part of the future',
    buttonText: 'Register Today',
    buttonLink: '#register',
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(index + 1, 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  const goToSlide = (newIndex, dir = 1) => {
    setDirection(dir);
    setIndex((newIndex + slides.length) % slides.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToSlide(index + 1, 1),
    onSwipedRight: () => goToSlide(index - 1, -1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden" {...handlers}>
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1], // smooth easing (ease-in-out)
            }}
            className="absolute w-full h-full"
          >
            <img
              src={slides[index].image}
              alt={slides[index].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-2xl md:text-5xl font-bold mb-2">{slides[index].title}</h2>
              <p className="text-md md:text-xl mb-4">{slides[index].subtitle}</p>
              <a
                href={slides[index].buttonLink}
                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:scale-105 transition"
              >
                {slides[index].buttonText}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i, i > index ? 1 : -1)}
            className={`w-3 h-3 rounded-full ${
              i === index ? 'bg-yellow-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
