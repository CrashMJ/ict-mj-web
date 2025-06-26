// src/components/ReviewsSection.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const reviews = [
  {
    name: 'නදුනි පෙරේරා',
    review: 'ඉතාම සංවිධානය කළ පන්ති හා සහයෝගී මග පෙන්වීම්. මම විභාගය හොඳින් සමත් විය!',
    avatar: '/avatars/avatar1.jpg',
    class: '2022 A/L'
  },
  {
    name: 'තරින්දු සිල්වා',
    review: 'අතිශය ප්‍රායෝගික අධ්‍යාපන ක්‍රම හා වටිනා පසුගිය ප්‍රශ්න පරීක්ෂා. ඉතාමත් නිර්දේශ කළ හැක.',
    avatar: '/avatars/avatar2.jpg',
    class: '2023 A/L'
  },
  {
    name: 'ඉසුරු ප්‍රනාන්දු',
    review: 'පැහැදිලි විවරණ හා සාරාංශ පන්ති නිසා මට විභාගයට විශ්වාසය උපන් විය.',
    avatar: '/avatars/avatar3.jpg',
    class: '2020 A/L'
  },
  {
    name: 'ශවින්ද්‍ර ජයසිංහ',
    review: 'කාලීන පරීක්ෂණ සහ ප්‍රායෝගික පන්ති මගින් මගේ දැනුම වැඩි විය.',
    avatar: '/avatars/avatar4.jpg',
    class: '2024 A/L'
  },
  {
    name: 'තිසර ගුණරත්න',
    review: 'ගුරුවරයාගේ උදව් මගින් මට ගණිතය පහසුවෙන් තේරුම් ගත හැකි විය.',
    avatar: '/avatars/avatar5.jpg',
    class: '2023 A/L'
  },
  {
    name: 'කවින්ද ජයරත්න',
    review: 'පෙර පරීක්ෂණ හා විවරණ සමග පැහැදිලි මග පෙන්වීම් ලැබුණි.',
    avatar: '/avatars/avatar6.jpg',
    class: '2021 A/L'
  },
  {
    name: 'දිනුෂි විජේසූරිය',
    review: 'විභාග සාර්ථකත්වය සඳහා හොඳම පන්ති හා මග පෙන්වීම්.',
    avatar: '/avatars/avatar7.jpg',
    class: '2024 A/L'
  },
  {
    name: 'රවින්ද නවරත්න',
    review: 'පෙර පරීක්ෂණ, සාරාංශ හා කෙටි සටහන් මගින් ඉතා වටිනා අධ්‍යාපනයක් ලැබුණි.',
    avatar: '/avatars/avatar8.jpg',
    class: '2023 A/L'
  },
];

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  const nextGroup = () => setCurrent((current + 1) % Math.ceil(reviews.length / 3));
  const prevGroup = () => setCurrent((current - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));

  useEffect(() => {
    const interval = setInterval(() => {
      nextGroup();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const groups = [];
  for (let i = 0; i < reviews.length; i += 3) {
    groups.push(reviews.slice(i, i + 3));
  }

  return (
    <section id="reviews" className="py-20 bg-zinc-50 px-4 md:px-20">
      <motion.h2
        className="text-3xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Student Reviews
      </motion.h2>

      <div className="relative">
        <motion.div
          key={current}
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {groups[current].map((r, i) => (
            <div key={i} className="bg-white shadow-md rounded-xl p-6 text-center flex flex-col items-center">
              {/* <img
                src={r.avatar}
                alt={r.name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              /> */}
              <p className="text-gray-600 italic mb-4">“{r.review}”</p>
              <p className="text-yellow-500 font-semibold">— {r.name} —</p>
              <p className="text-sm text-yellow-500">{r.class} </p>
            </div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-2 mt-6">
          {groups.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${index === current ? 'bg-yellow-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <div className="flex justify-between mt-6 max-w-6xl mx-auto px-4">
          <button
            onClick={prevGroup}
            className="px-4 py-2 bg-white rounded shadow hover:bg-yellow-100 transition"
          >
            ←
          </button>
          <button
            onClick={nextGroup}
            className="px-4 py-2 bg-white rounded shadow hover:bg-yellow-100 transition"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}