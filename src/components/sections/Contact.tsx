'use client';

import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <p className="text-sm text-muted-foreground font-medium mb-4">Get in Touch</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Scan to chat on Telegram
          </h2>
          <p className="text-muted-foreground mb-8">@CHEANLONGZHOU</p>

          <a
            href="https://t.me/CHEANLONGZHOU"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border group-hover:shadow-xl group-hover:ring-amber-400/30 transition-all duration-300">
              <img
                src="/telegram-qr.png"
                alt="Scan QR code to chat on Telegram"
                className="w-full h-full object-cover"
              />
            </div>
          </a>

          <p className="text-xs text-muted-foreground mt-6">
            Available daily 9am – 9pm
          </p>
        </motion.div>
      </div>
    </section>
  );
}