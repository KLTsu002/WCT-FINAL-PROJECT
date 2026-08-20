'use client';

import { motion } from 'framer-motion';

const brands = ['Forbes', 'Wired', 'TechCrunch', 'Bloomberg', 'The Verge'];

export default function TrustBar() {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium text-muted-foreground mb-6 tracking-widest uppercase">
          As featured in
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 sm:gap-x-14 lg:gap-x-16 gap-y-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-lg sm:text-xl font-display font-bold text-muted-foreground/30 dark:text-navy-400/30 select-none"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
