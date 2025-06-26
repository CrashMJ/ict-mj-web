import { motion } from 'framer-motion';

export default function Paper() {
  return (
    <section id="paper" className="py-20 px-4 md:px-20 bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4"
      >
      <h2 className="text-3xl font-bold mb-6">The Final Paper Class</h2>
      <div className="md:flex justify-center gap-10">
        <div className="md:w-1/2">
          <p className="mb-4">
            Exclusive revision sessions to cover past papers and exam-focused discussions
            with senior lecturers. Available for A/L 2024 and 2025 students.
          </p>
        </div>
        <div className="md:w-1/2">
          <p>
            Live classes, mock exams, downloadable materials, and direct Telegram support. 
            Join now and boost your final exam confidence.
          </p>
        </div>
      </div>
      </motion.div>
    </section>
  );
}