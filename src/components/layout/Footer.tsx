import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { WHATSAPP, INSTAGRAM, PHONE } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-display text-2xl font-bold text-primary-dark">Snackwize</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Let's Make India Healthy 🇮🇳</p>
          <p className="mt-2 font-mono-accent text-xs text-muted-foreground">Homemade · Baked · Honest</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
            <li><Link to="/about" className="hover:text-primary">Our Story</Link></li>
            <li><Link to="/testimonials" className="hover:text-primary">Testimonials</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/signup" className="hover:text-primary">Sign up</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Reach us</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{PHONE}</a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Instagram className="h-4 w-4" />@snackwize</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Snackwize · Made with ❤️ in Mumbai
      </div>
    </footer>
  );
}