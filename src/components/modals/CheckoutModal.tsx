    
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  CheckCircle2,
  CloudOff,
  Package,
  Shield,
  Lock,
  RotateCcw,
  Mail,
  Truck,
  Copy,
  CreditCard,
  Check,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/lib/store';
import { productImg } from '@/lib/products';
import { toast } from 'sonner';

export default function CheckoutModal() {
  const { items, isCheckoutOpen, setCheckoutOpen, getTotal, getCo2Offset, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoCode, setPromoCode] = useState('');
  const [copied, setCopied] = useState(false);

  const subtotal = getTotal();
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.card.trim() || form.card.replace(/\s/g, '').length < 13) e.card = 'Valid card number required';
    if (!form.expiry.trim() || !/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry.trim())) e.expiry = 'MM/YY format';
    if (!form.cvv.trim() || form.cvv.length < 3) e.cvv = '3+ digits';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, address: form.address },
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.order.orderId);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.error || 'Order failed');
      }
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    if (orderId) { setOrderId(''); setForm({ name: '', email: '', address: '', card: '', expiry: '', cvv: '' }); }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    toast.success('Order ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shippingFields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
    { key: 'address', label: 'Shipping Address', type: 'text', placeholder: '123 Solar Lane, Austin TX' },
  ];

  const paymentFields = [
    { key: 'card', label: 'Card Number', type: 'text', placeholder: '4242 4242 4242 4242' },
    { key: 'expiry', label: 'Expiry', type: 'text', placeholder: 'MM/YY' },
    { key: 'cvv', label: 'CVV', type: 'text', placeholder: '123' },
  ];

  const renderField = (field: { key: string; label: string; type: string; placeholder: string }) => (
    <div key={field.key}>
      <Label className="text-sm font-medium">{field.label}</Label>
      <Input
        type={field.type}
        placeholder={field.placeholder}
        value={form[field.key as keyof typeof form]}
        onChange={(e) => update(field.key, e.target.value)}
        className={`mt-1.5 rounded-xl ${errors[field.key] ? 'border-destructive' : ''}`}
      />
      {errors[field.key] && <p className="text-destructive text-xs mt-1">{errors[field.key]}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-y-8 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50 bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-bold">Checkout</h2>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-muted transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {orderId ? (
                /* ── Enhanced Confirmation ── */
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                  {/* Animated green checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-sgreen-500 dark:text-sgreen-400" strokeWidth={1.5} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-2xl font-bold mt-4"
                  >
                    Order Confirmed!
                  </motion.h3>

                  {/* Copyable order ID */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 mt-4"
                  >
                    <span className="text-sm text-muted-foreground">Order ID:</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span className="font-mono text-sm font-semibold text-navy-700 dark:text-ivory-200">{orderId}</span>
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-sgreen-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </motion.div>

                  {/* What's next */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 w-full max-w-sm"
                  >
                    <h4 className="font-display text-base font-semibold mb-4">What&apos;s next?</h4>
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-sgreen-500/10">
                          <Mail className="w-4 h-4 text-sgreen-500 dark:text-sgreen-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Confirmation email sent</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Check your inbox for order details and receipt</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-amber-400/10">
                          <MessageCircle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Track via Telegram</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Message <a href="https://t.me/CHEANLONGZHOU" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-medium">@CHEANLONGZHOU</a> for real-time updates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-navy-700/10 dark:bg-navy-300/10">
                          <Truck className="w-4 h-4 text-navy-700 dark:text-navy-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estimated delivery: 5-7 business days</p>
                          <p className="text-xs text-muted-foreground mt-0.5">You&apos;ll receive tracking info once shipped</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button onClick={handleClose} className="btn-amber mt-8 rounded-xl px-8">
                      Continue Shopping
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-6 p-6">
                  {/* ── Form (left) ── */}
                  <div className="md:col-span-3 space-y-5">
                    <h3 className="font-semibold">Shipping & Payment</h3>

                    {/* Shipping fields */}
                    {shippingFields.map(renderField)}

                    {/* Payment method icons */}
                    <div className="flex items-center gap-2 pt-1">
                      {['VISA', 'MC', 'AMEX'].map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-md border border-border text-muted-foreground"
                        >
                          <CreditCard className="w-3 h-3" />
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* Payment fields */}
                    {paymentFields.map(renderField)}
                  </div>

                  {/* ── Order Summary (right) ── */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-4">Order Summary</h3>

                    {/* Items list */}
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={productImg(item.img, 96, 96)} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                          </div>
                          <span className="text-sm font-medium shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="mt-4 pt-4 border-t border-border space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>

                      {/* Estimated Shipping */}
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Shipping</span>
                          <span className="text-sgreen-500 dark:text-sgreen-400 font-medium">FREE</span>
                        </div>
                        <p className="flex items-center gap-1 text-xs text-sgreen-500/80 dark:text-sgreen-400/80 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Free shipping on orders over $200
                        </p>
                      </div>

                      {/* Estimated Tax */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Tax</span>
                        <span>${tax.toLocaleString()}</span>
                      </div>

                      {/* Promo code input */}
                      <div className="pt-1">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="h-9 rounded-lg text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 px-3 rounded-lg text-sm shrink-0"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>

                      {/* Bold total */}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* CO₂ offset info */}
                    <div className="flex items-center gap-2 mt-3 text-sm text-sgreen-500 dark:text-sgreen-400">
                      <CloudOff className="w-4 h-4" />
                      <span>{getCo2Offset().toLocaleString()} kg CO₂ offset</span>
                    </div>
                  </div>

                  {/* ── Place Order + Trust Badges ── */}
                  <div className="md:col-span-5 space-y-4">
                    <Button type="submit" disabled={loading} className="btn-amber w-full py-5 rounded-xl text-base">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Package className="w-5 h-5 mr-2" /> Place Order — ${total.toLocaleString()}</>}
                    </Button>

                    {/* Security trust badges */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="w-3.5 h-3.5" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>30-Day Returns</span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Order Guaranteed</span>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
