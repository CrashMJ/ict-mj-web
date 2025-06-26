// src/components/Footer.jsx
import { useEffect, useState } from 'react';
import { FaFacebookF, FaWhatsapp, FaYoutube, FaTelegramPlane, FaArrowUp } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 },
      });
    }
  }, [inView, controls]);

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="relative bg-gray-900 text-white px-6 md:px-20 py-12"
    >
      {/* Main Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Slogan */}
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">ICT MJ</h1>
          <p className="mt-3 text-sm text-gray-300">
            Empowering students for the future with high-quality ICT education and support.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#about" className="hover:text-yellow-400">About</a></li>
            <li><a href="#reviews" className="hover:text-yellow-400">Reviews</a></li>
            <li><a href="#telegram" className="hover:text-yellow-400">Telegram</a></li>
            <li><a href="#contact" className="hover:text-yellow-400">Contact</a></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">Contact</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>Email: <a href="mailto:info@ictmj.lk" className="hover:text-yellow-400">info@ictmj.lk</a></li>
            <li>Phone: <a href="tel:+94712345678" className="hover:text-yellow-400">+94 71 234 5678</a></li>
            <li>Address: Kandy, Sri Lanka</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/94712345678" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
              <FaWhatsapp />
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaYoutube />
            </a>
            <a href="https://t.me/examplegroup1" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg transition duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} ICT MJ. All rights reserved.
      </div>
    </motion.footer>
  );
}
