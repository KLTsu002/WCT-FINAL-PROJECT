'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import Stats from '@/components/sections/Stats';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Shop from '@/components/sections/Shop';
import Calculator from '@/components/sections/Calculator';
import Impact from '@/components/sections/Impact';
import Newsletter from '@/components/sections/Newsletter';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import CartDrawer from '@/components/modals/CartDrawer';
import ProductModal from '@/components/modals/ProductModal';
import CheckoutModal from '@/components/modals/CheckoutModal';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <motion.div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />

      <main className="min-h-screen flex flex-col">
        <Hero />
        <TrustBar />
        <Stats />
        <FeaturedProducts />
        <Shop />
        <Calculator />
        <Impact />
        <Newsletter />
        <Contact />
        <div className="flex-1" />
      </main>

      <Footer />
    </>
  );
}
