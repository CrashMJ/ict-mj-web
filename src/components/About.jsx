import { motion } from 'framer-motion';
import aboutImg from '../assets/sir.png'; // replace with actual image

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50 px-4 md:px-20">
      <div className="max-w-6xl mx-auto md:flex items-center gap-12">
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span role="img" aria-label="pen">🖋️</span> ගුරුවරයා පිළිබඳව
          </h2>
          <p className="text-6xl leading-none text-gray-300 mb-4">“</p>
          <p className="text-lg leading-relaxed text-gray-800">
            2016 වසරේදී ගණිත අංශයෙන් උසස් පෙළ විභාගය පෙනී සිටින ඔබට වාසිවී ඉගෙනීමේ
            ජර්මනියෙකු වාතා කළමනාකරණ මෝඩුවට විශ්වවිද්යාලයේ ඉන්ජිනේරු පීඨය සදහා
            ලැබූ අභිමානය මේ වන විට ඇත. ඒ අනුව ඔහු ජීවිතයක ලැබූ පළාත් සම්පූර්ණ
            කරමින් සිටී. 2016 සැප්තැම්බර් සිට මේ වන විට පුරා අවුරුදු 5ක් පුරාකාලය පුරා
            ක්ෂේත්‍රයේ දළදාවත් අතැ මොහොතේ භවිතා කිරීමෙන් ජර්මනියෙන් නොවට
            වැනිභාවිතාව අමතක වන තරමක් කාලාත් ජර්මනියක් වෙන රටක ගණිතය පිළිබඳව
            විශේෂත්වය ඔබට කියාට නොහැකයි.
          </p>
          <p className="text-6xl leading-none text-gray-300 text-right mt-4">”</p>
        </motion.div>

        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={aboutImg}
            alt="Guru"
            className="rounded-lg shadow-lg grayscale hover:grayscale-0 transition duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
}