'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { productImg, type Product } from '@/lib/products';
import { toast } from 'sonner';

export default function ProductModal() {
  const selectedProductId = useCartStore((s) => s.selectedProductId);
  const setSelectedProductId = useCartStore((s) => s.setSelectedProductId);
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, startLoading] = useTransition();
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedProductId || selectedProductId === fetchedRef.current) return;
    fetchedRef.current = selectedProductId;
    startLoading(async () => {
      try {
        const res = await fetch(`/api/products/${selectedProductId}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);
      } catch {/* ignore */}
    });
  }, [selectedProductId, startLoading]);

  const ecoClass = (score: string) =>
    score === 'A+' ? 'eco-badge-ap' : score === 'A' ? 'eco-badge-a' : 'eco-badge-b';

  const handleAdd = () => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, price: product.price, ecoScore: product.ecoScore, img: product.img });
    toast.success(`${product.name} added to cart`);
    setSelectedProductId(null);
  };

  return (
    <AnimatePresence>
      {selectedProductId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProductId(null)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 z-50 bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProductId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : product ? (
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-square md:aspect-auto">
                    <img
                      src={productImg(product.img, 700, 700)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${ecoClass(product.ecoScore)} border-0`}>{product.ecoScore} ECO</Badge>
                      {product.badge && (
                        <Badge className="bg-amber-400 text-navy-700 border-0 font-semibold">{product.badge}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 flex flex-col">
                    <div className="flex-1">
                      <h2 className="font-display text-2xl font-bold">{product.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                      </div>
                      <div className="mt-4 text-3xl font-bold font-display text-navy-700 dark:text-navy-300">
                        ${product.price}
                      </div>
                      <p className="text-muted-foreground mt-4 leading-relaxed">{product.desc}</p>

                      {/* Specs table */}
                      {product.specs.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-sm font-semibold mb-3">Specifications</h3>
                          <div className="rounded-xl border border-border overflow-hidden">
                            {product.specs.map((spec, i) => (
                              <div key={spec.k} className={`flex justify-between px-4 py-2.5 text-sm ${i > 0 ? 'border-t border-border' : ''} ${i % 2 === 0 ? 'bg-muted/50' : ''}`}>
                                <span className="text-muted-foreground">{spec.k}</span>
                                <span className="font-medium">{spec.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button onClick={handleAdd} className="btn-amber w-full py-5 rounded-xl text-base mt-6">
                      <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart — ${product.price}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
