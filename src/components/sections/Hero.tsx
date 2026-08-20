'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Star, ShoppingCart, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { productImg } from '@/lib/products';

export default function Hero() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddHero = () => {
    addItem({
      id: 'helios-400',
      name: 'Helios 400W Residential Panel',
      price: 349,
      ecoScore: 'A+',
      img: 'helios-400',
    });
  };

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-sky"
    >
      {/* Decorative sun glow - light mode only */}
      <div className="absolute top-16 right-16 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl dark:hidden" />
      <div className="absolute bottom-32 right-32 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl dark:hidden" />
      {/* Dark mode stars */}
      <div className="hidden dark:block absolute inset-0">
        <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute top-[8%] right-[25%] w-1.5 h-1.5 bg-white/20 rounded-full" />
        <div className="absolute top-[25%] right-[15%] w-1 h-1 bg-white/25 rounded-full" />
        <div className="absolute top-[12%] left-[45%] w-0.5 h-0.5 bg-white/20 rounded-full" />
        <div className="absolute top-[20%] left-[70%] w-1 h-1 bg-white/15 rounded-full" />
        <div className="absolute top-[35%] left-[20%] w-1.5 h-1.5 bg-white/10 rounded-full" />
        <div className="absolute top-[5%] left-[80%] w-1 h-1 bg-white/20 rounded-full" />
      </div>
      {/* Green accent glow - both modes */}
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-sgreen-500/5 rounded-full blur-3xl dark:bg-sgreen-500/8" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-navy-700 dark:text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-700/10 dark:bg-white/10 border border-navy-700/20 dark:border-white/15 text-xs text-navy-700/80 dark:text-white/80 mb-5"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              Now shipping nationwide
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Power your life{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                with sunlight.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-navy-700/70 dark:text-white/70 max-w-xl mb-8 leading-relaxed">
              Premium solar panels, eco-home essentials, and sustainable lifestyle products designed to shrink your carbon footprint — without compromising on quality.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => handleScroll('#shop')}
                className="btn-amber px-8 py-6 text-base rounded-2xl"
              >
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                onClick={() => handleScroll('#calculator')}
                className="border-navy-700 dark:border-white/25 text-navy-700 dark:text-white hover:bg-navy-700/10 dark:hover:bg-white/10 hover:text-navy-700 dark:hover:text-white px-8 py-6 text-base rounded-2xl"
              >
                Calculate Savings
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 sm:gap-8">
              {[
                { icon: Shield, label: '25yr Warranty' },
                { icon: Zap, label: '98% Efficiency' },
                { icon: Star, label: '4.9★ Rating' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-navy-700/60 dark:text-white/60">
                  <div className="w-9 h-9 rounded-lg bg-navy-700/10 dark:bg-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-navy-700 dark:text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Featured product card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md border border-navy-700/10 dark:border-white/15 rounded-2xl p-5 shadow-lg dark:shadow-none">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                <img
                  src={productImg('helios-400', 600, 450)}
                  alt="Helios 400W Solar Panel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="eco-badge-ap text-xs mb-2 border-0">A+ ECO</Badge>
                  <h3 className="text-navy-700 dark:text-white font-semibold text-lg">Helios 400W Residential Panel</h3>
                  <p className="text-navy-700/50 dark:text-white/50 text-sm mt-1">22% efficiency · 25-year warranty</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-amber-400">$349</div>
                  <div className="flex items-center gap-1 text-navy-700/50 dark:text-white/50 text-xs mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 (384)
                  </div>
                </div>
              </div>
              <Button onClick={handleAddHero} className="btn-amber w-full mt-4 py-5 rounded-xl text-sm">
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </div>

            {/* Floating savings badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-500 text-navy-700 px-4 py-2.5 rounded-2xl shadow-xl"
            >
              <div className="text-xs font-semibold opacity-80">Avg. Savings</div>
              <div className="text-xl font-bold">$1,840/yr</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
