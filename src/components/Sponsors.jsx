import { motion } from 'framer-motion';

import sponsor1 from '../assets/sponsor.png';
import sponsor2 from '../assets/sponsor.png';
import sponsor3 from '../assets/sponsor.png';
import sponsor4 from '../assets/sponsor.png';

export default function Sponsors() {
  const sponsorImages = [sponsor1, sponsor2, sponsor3, sponsor4];

  return (
    <section className="py-10 bg-white text-center" id="sponsors">
      <h2 className="text-3xl font-bold mb-8">Our Sponsors</h2>
      <div className="flex justify-center items-center flex-wrap gap-8 px-4">
        {sponsorImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Sponsor ${i + 1}`}
            className="h-16 md:h-24 object-contain grayscale hover:grayscale-0 transition duration-300"
          />
        ))}
      </div>
    </section>
  );
}