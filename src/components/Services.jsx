import { motion } from 'framer-motion';

function Services() {
  return (
    <section id="services" className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Industrial Chemicals</h3>
            <p>High-quality chemicals for manufacturing, processing, and industry-grade operations.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Agricultural Solutions</h3>
            <p>Products tailored for farming and agricultural productivity.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Lab Supplies</h3>
            <p>Everything from lab reagents to safety equipment and glassware.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;