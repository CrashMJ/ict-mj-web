// src/components/TelegramSection.jsx
import { motion } from 'framer-motion';
import { FaTelegramPlane, FaBookOpen, FaComments } from 'react-icons/fa';

export default function TelegramSection() {
  return (
    <section id="telegram" className="py-20 bg-gradient-to-br from-blue-50 to-white px-4 md:px-20">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Join Our Telegram Channels</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Stay connected with the latest updates, notes, and live Q&A sessions. Join our Telegram communities and never miss out!
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href="https://t.me/examplegroup1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition transform hover:scale-105"
          >
            <FaTelegramPlane className="mr-2 text-xl" /> <FaBookOpen className="mr-2 text-lg" /> Study Group
          </a>

          <a
            href="https://t.me/examplegroup2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition transform hover:scale-105"
          >
            <FaTelegramPlane className="mr-2 text-xl" /> <FaComments className="mr-2 text-lg" /> Discussion Group
          </a>
        </div>
      </motion.div>
    </section>
  );
}
