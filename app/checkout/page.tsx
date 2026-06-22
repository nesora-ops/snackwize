'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, PartyPopper, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getUser, type MockUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { deliveryFeeFor } from '@/lib/pricing';
import { toast } from 'sonner';

type Step = 'address' | 'payment' | 'confirmation';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'address',      label: 'Address',      icon: <MapPin className="h-4 w-4" /> },
  { id: 'payment',      label: 'Payment',       icon: <CreditCard className="h-4 w-4" /> },
  { id: 'confirmation', label: 'Confirmation',  icon: <CheckCircle2 className="h-4 w-4" /> },
];

const PAYMENT_OPTIONS = [
  { id: 'upi',  label: 'UPI',                description: 'Pay via any UPI app',    icon: '⚡' },
  { id: 'cod',  label: 'Cash on Delivery',   description: 'Pay when order arrives', icon: '💵' },
  { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay', icon: '💳' },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
              done   ? 'bg-primary text-white' :
              active ? 'bg-primary text-white ring-4 ring-primary/20' :
                       'bg-surface text-muted-foreground border border-border'
            }`}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:inline ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const { loading } = useAuthGuard();

  const { items, total, count, clear } = useCart();
  const [user, setUser] = useState<MockUser | null>(null);
  const [step, setStep] = useState<Step>('address');
  const [mounted, setMounted] = useState(false);
  // Order id is assigned by the server on placement, not the client.
  const [orderNumber, setOrderNumber] = useState('');

  // Address form
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', landmark: '', pincode: '', city: '', state: '' });
  // Payment
  const [payMethod, setPayMethod] = useState<string>('upi');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener('snackwize-auth', sync);
    return () => window.removeEventListener('snackwize-auth', sync);
  }, []);

  useEffect(() => {
    if (user && mounted) {
      setForm((f) => ({ ...f, name: user.name ?? '' }));
    }
  }, [user, mounted]);

  if (!mounted || loading) return null;

  const deliveryFee = deliveryFeeFor(total);
  const grandTotal = total + deliveryFee;
  const validPin = /^\d{6}$/.test(form.pincode);

  // ─── STEP: ADDRESS ────────────────────────────────────────────────────────
  if (step === 'address') {
    const valid = form.name && form.phone && form.address && form.city && form.state && validPin
      && (user || form.email);
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <Link href="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <StepIndicator current="address" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            {/* Address Form */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkout-name">Full Name</Label>
                    <Input
                      id="checkout-name"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout-phone">Phone Number</Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      placeholder="98xxxxxxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                {!user && (
                  <div>
                    <Label htmlFor="checkout-email">Email (for order updates &amp; receipt)</Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="checkout-address">Address (Flat, Building, Street)</Label>
                  <Input
                    id="checkout-address"
                    placeholder="Flat 4B, Sunshine Apartments, MG Road"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="checkout-landmark">Landmark (optional)</Label>
                  <Input
                    id="checkout-landmark"
                    placeholder="Near City Mall"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="checkout-city">City</Label>
                    <Input
                      id="checkout-city"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout-state">State</Label>
                    <Input
                      id="checkout-state"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout-pincode">PIN Code</Label>
                    <Input
                      id="checkout-pincode"
                      placeholder="400001"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                id="checkout-continue-payment"
                className="mt-6 w-full bg-primary hover:bg-primary-dark rounded-xl py-6 text-base font-semibold gap-2"
                disabled={!valid}
                onClick={() => setStep('payment')}
              >
                Continue to Payment
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Order Mini-Summary */}
            <OrderSummaryCard items={items} total={total} deliveryFee={deliveryFee} grandTotal={grandTotal} />
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP: PAYMENT ───────────────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <button onClick={() => setStep('address')} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Address
          </button>
          <StepIndicator current="payment" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    id={`payment-${opt.id}`}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                      payMethod === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payMethod === opt.id}
                      onChange={() => setPayMethod(opt.id)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === opt.id ? 'border-primary' : 'border-border'
                    }`}>
                      {payMethod === opt.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                🔒 This is a demo checkout. No real payment will be processed.
              </div>

              <Button
                id="checkout-place-order"
                className="mt-6 w-full bg-primary hover:bg-primary-dark rounded-xl py-6 text-base font-semibold gap-2"
                disabled={placing}
                onClick={async () => {
                  setPlacing(true);
                  const { data: { session } } = await supabase.auth.getSession();
                  // Send only item ids + quantities. The server looks up live
                  // prices and computes subtotal/delivery/total authoritatively.
                  const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
                    },
                    body: JSON.stringify({
                      guest_name: form.name,
                      guest_phone: form.phone,
                      guest_email: form.email || undefined,
                      items: items.map(i => ({ id: i.id, qty: i.qty })),
                      address: {
                        line1: form.address,
                        city: form.city,
                        state: form.state,
                        pin: form.pincode,
                        landmark: form.landmark || undefined,
                      },
                      payment_method: payMethod,
                    }),
                  });
                  setPlacing(false);
                  if (!res.ok) {
                    const { error } = await res.json().catch(() => ({ error: null }));
                    return toast.error(error ?? 'Order failed. Please try again.');
                  }
                  const { id } = await res.json();
                  setOrderNumber(id);
                  clear();
                  setStep('confirmation');
                }}
              >
                Place Order · ₹{grandTotal}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <OrderSummaryCard items={items} total={total} deliveryFee={deliveryFee} grandTotal={grandTotal} />
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP: CONFIRMATION ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <PartyPopper className="h-12 w-12 text-green-600" />
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Placed! 🎉</h1>
        <p className="text-muted-foreground text-sm mb-1">Thank you for your order, {user?.name.split(' ')[0]}!</p>

        <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono-accent uppercase tracking-wider text-muted-foreground">Order ID</p>
              <p className="font-bold text-lg text-primary">{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono-accent uppercase tracking-wider text-muted-foreground">Amount Paid</p>
              <p className="font-bold text-lg text-foreground">₹{grandTotal}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <Truck className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated Delivery</p>
              <p className="text-xs text-muted-foreground">3–5 business days · Pan India shipping</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            You will receive a WhatsApp confirmation from Nupur shortly.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/menu" id="back-to-menu-btn">
            <Button variant="outline" className="rounded-full px-6 w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard" id="view-orders-btn">
            <Button className="bg-primary hover:bg-primary-dark rounded-full px-6 w-full sm:w-auto">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER SUMMARY SIDEBAR ────────────────────────────────────────────────────
function OrderSummaryCard({
  items, total, deliveryFee, grandTotal
}: {
  items: ReturnType<typeof useCart>['items'];
  total: number;
  deliveryFee: number;
  grandTotal: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 h-fit sticky top-24">
      <h3 className="font-display font-bold text-base mb-4">Order Summary</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-surface">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">x{item.qty}</p>
            </div>
            <p className="text-xs font-semibold text-foreground shrink-0">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>
      <hr className="my-3 border-border" />
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Item total</span><span>₹{total}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span>
          {deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span>₹{deliveryFee}</span>}
        </div>
        <div className="flex justify-between font-bold text-base text-foreground pt-1 border-t border-border">
          <span>Total</span><span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
