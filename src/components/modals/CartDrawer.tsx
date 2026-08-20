'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CloudOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { productImg } from '@/lib/products';

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, setCheckoutOpen, updateQty, removeItem, getTotal, getItemCount, getCo2Offset } = useCartStore();

  const ecoClass = (score: string) =>
    score === 'A+' ? 'eco-badge-ap' : score === 'A' ? 'eco-badge-a' : 'eco-badge-b';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-display text-lg font-bold">Your Cart</h2>
                <Badge variant="secondary" className="ml-1">{getItemCount()}</Badge>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-border bg-card">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <img src={productImg(item.img, 160, 160)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <Badge className={`${ecoClass(item.ecoScore)} text-[10px] mt-1 border-0`}>{item.ecoScore}</Badge>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-1 rounded-lg hover:bg-muted transition-colors shrink-0" aria-label="Remove">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors" aria-label="Decrease quantity">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors" aria-label="Increase quantity">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-sm">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-bold">${getTotal().toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-sgreen-500 dark:text-sgreen-400">
                  <CloudOff className="w-4 h-4" />
                  <span>{getCo2Offset().toLocaleString()} kg CO₂ offset</span>
                </div>
                <Button
                  onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  className="btn-amber w-full py-5 rounded-xl text-base"
                >
                  Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
