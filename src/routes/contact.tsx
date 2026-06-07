import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, Instagram, MapPin } from "lucide-react";
import { WHATSAPP, INSTAGRAM, PHONE } from "@/lib/data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Snackwize" },
      { name: "description", content: "Get in touch with Snackwize — Mumbai's homemade healthy snack brand." },
      { property: "og:title", content: "Contact Snackwize" },
      { property: "og:description", content: "DM us for our full menu, custom hampers and bulk orders." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">Get in touch</p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">Say hello.</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Questions, hampers, bulk orders, or just snack love — we're listening.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" rows={5} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Send Message</Button>
            </div>
          </form>

          <div className="space-y-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-light text-primary-dark"><Phone className="h-5 w-5" /></div>
              <div><p className="text-xs font-mono-accent uppercase tracking-wider text-muted-foreground">Call</p><p className="font-semibold">{PHONE}</p></div>
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366]/15 text-[#1ebe57]"><MessageCircle className="h-5 w-5" /></div>
              <div><p className="text-xs font-mono-accent uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="font-semibold">Chat with us</p></div>
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] text-white"><Instagram className="h-5 w-5" /></div>
              <div><p className="text-xs font-mono-accent uppercase tracking-wider text-muted-foreground">Instagram</p><p className="font-semibold">@snackwize</p></div>
            </a>

            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="font-display text-2xl font-bold">DM us for our vast menu</p>
              <p className="mt-2 text-sm opacity-90">Custom hampers, seasonal specials, bulk orders — we'll send the full list straight to your chat.</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary-dark">Open WhatsApp →</a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-48 bg-surface">
                <div className="absolute inset-0 grain opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-7 w-7 text-primary" />
                    <p className="mt-2 font-display text-lg font-bold">Mumbai, India</p>
                    <p className="font-mono-accent text-xs text-muted-foreground">Baked & shipped daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}