'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Eye, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/lib/store';
import { productImg, categoryLabels, type Product } from '@/lib/products';
import { toast } from 'sonner';

const categories = ['all', 'solar', 'chargers', 'home', 'lifestyle'];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const setSelectedProductId = useCartStore((s) => s.setSelectedProductId);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('category', filter);
      if (sort !== 'featured') params.set('sort', sort);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, ecoScore: p.ecoScore, img: p.img });
    toast.success(`${p.name} added to cart`);
  };

  const ecoClass = (score: string) =>
    score === 'A+' ? 'eco-badge-ap' : score === 'A' ? 'eco-badge-a' : 'eco-badge-b';

  return (
    <section id="shop" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Shop All Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-base"
          >
            Everything you need for a greener tomorrow
          </motion.p>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  filter === cat
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="eco">Best Eco Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-9 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden card-hover group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={productImg(p.img, 500, 500)}
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
                    <h3 className="font-semibold text-sm leading-snug line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-foreground">${p.price}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAdd(p)}
                        className="btn-amber rounded-xl"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1.5" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
