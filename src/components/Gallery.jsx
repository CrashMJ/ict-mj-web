import { motion } from 'framer-motion';

import gallery1 from '../assets/gallery1.jpg';
import gallery2 from '../assets/gallery2.jpeg';
import gallery3 from '../assets/gallery3.jpeg';
import gallery4 from '../assets/gallery4.jpeg';
const images = [gallery1, gallery2, gallery3, gallery4];

export default function Gallery() {
  return (
    <section id="gallery" className="px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-8 ">Our Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`gallery-${i}`}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>
    </section>
  );
}