'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { productImg, type Product } from '@/lib/products';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const setSelectedProductId = useCartStore((s) => s.setSelectedProductId);

  useEffect(() => {
    fetch('/api/products/featured')
      .then((r) => r.json())
      .then((d) => d.success && setFeatured(d.products));
  }, []);

  const ecoClass = (score: string) =>
    score === 'A+' ? 'eco-badge-ap' : score === 'A' ? 'eco-badge-a' : 'eco-badge-b';

  return (
    <section className="py-20 sm:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-base"
          >
            Hand-picked for maximum impact
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden card-hover group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={productImg(p.img, 500, 375)}
                  alt={p.name}
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge className={`${ecoClass(p.ecoScore)} text-xs border-0`}>{p.ecoScore} ECO</Badge>
                  {p.badge && (
                    <Badge className="bg-amber-400 text-navy-700 text-xs border-0 font-semibold">
                      {p.badge}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProductId(p.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 dark:bg-charcoal/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-foreground shrink-0">${p.price}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addItem({ id: p.id, name: p.name, price: p.price, ecoScore: p.ecoScore, img: p.img })}
                  className="btn-amber w-full mt-3 rounded-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
