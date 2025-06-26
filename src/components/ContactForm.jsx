import { motion } from 'framer-motion';

export default function ContactForm() {
  return (
    <section id="contact" className="py-10 px-4 md:px-20 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
      <form className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded p-3"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded p-3"
          />
        </div>
        <div className="mb-4">
          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded p-3"
          ></textarea>
        </div>
        <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:scale-105 transition">
          Send
        </button>
      </form>
    </section>
  );
}