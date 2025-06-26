import { motion } from 'framer-motion';

export default function WorkProcess() {
  const steps = ["Register", "Attend Sessions", "Download Materials", "Join Telegram", "Practice Exams"];

  return (
    <section id="work" className="py-20 bg-gray-100 text-center">
      <motion.h2
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        Work Process
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="bg-white shadow-md p-6 rounded-lg w-40"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="text-yellow-500 text-4xl font-bold mb-2">{i + 1}</div>
            <p>{step}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}