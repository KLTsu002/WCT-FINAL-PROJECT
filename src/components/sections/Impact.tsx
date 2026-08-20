'use client';

import { motion } from 'framer-motion';
import { Check, Leaf } from 'lucide-react';

const features = [
  '25-year warranty on all solar panels',
  'Free shipping on orders over $200',
  '30-day hassle-free returns',
  'Certified B Corporation',
  'Carbon-neutral shipping',
  'Expert solar consultation',
];

export default function Impact() {
  return (
    <section id="impact" className="py-20 sm:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sgreen-500/10 text-sgreen-500 dark:text-sgreen-400 text-xs font-medium mb-4">
              <Leaf className="w-3.5 h-3.5" /> Our Mission
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Making clean energy accessible to everyone
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              At SolterraGreen, we believe every home deserves access to affordable, sustainable energy.
              Our curated selection of solar panels, eco-home products, and sustainable lifestyle essentials
              makes it easy to reduce your environmental impact without sacrificing quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2.5 py-2"
              >
                <div className="w-5 h-5 rounded-full bg-sgreen-500/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-sgreen-500 dark:text-sgreen-400" />
                </div>
                <span className="text-sm text-foreground/80">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Image with overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[400px]"
        >
          <img
            src="/products/helios-600.png"
            alt="Solar panels installation"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-700/80 to-navy-700/30" />
          <div className="relative z-10 flex flex-col justify-center h-full min-h-[300px] sm:min-h-[400px] p-8 sm:p-12">
            <p className="text-amber-400 font-display text-base font-semibold mb-1">Community Impact</p>
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-white max-w-xl leading-tight">
              Powering a sustainable future, one home at a time
            </h3>
            <p className="text-white/60 mt-3 max-w-md text-sm sm:text-base">
              Our installations have contributed over 4.2MW of clean energy capacity to residential communities.
            </p>
          </div>
          <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 bg-gradient-to-br from-amber-400 to-amber-500 text-navy-700 px-4 py-3 rounded-xl shadow-lg">
            <div className="text-xs font-semibold opacity-80">Total Capacity</div>
            <div className="text-2xl font-bold font-display">4.2MW</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
