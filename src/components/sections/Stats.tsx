'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, CloudOff, Zap, Clock } from 'lucide-react';

const stats = [
  { value: 12400, suffix: '+', label: 'Homes Powered', icon: Home, prefix: '' },
  { value: 87000, suffix: 't', label: 'CO\u2082 Offset', icon: CloudOff, prefix: '' },
  { value: 2300000, suffix: '+', label: 'kWh Generated', icon: Zap, prefix: '', format: 'short' as const },
  { value: 8, suffix: 'yr', label: 'Avg. Payback', icon: Clock, prefix: '' },
];

function formatStat(value: number, format?: string): string {
  if (format === 'short') {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
  }
  return value.toLocaleString('en-US');
}

function AnimatedCounter({ target, suffix, format, started }: { target: number; suffix: string; format?: string; started: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const duration = 2000;

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target]);

  return (
    <span ref={ref}>
      {formatStat(count, format)}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Trusted by thousands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-base"
          >
            Real impact, real numbers
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 sm:p-8 rounded-2xl bg-muted/50"
            >
              <div className="inline-flex w-10 h-10 rounded-xl bg-navy-700/10 dark:bg-navy-700/20 items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-navy-700 dark:text-navy-300" />
              </div>
              <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} format={stat.format} started={inView} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
