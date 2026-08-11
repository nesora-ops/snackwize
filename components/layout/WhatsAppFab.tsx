import { WHATSAPP } from "@/lib/data";
import { WhatsAppIcon } from "./SocialIcons";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-[#25D366]/40 transition hover:scale-105"
    >
      <WhatsAppIcon size={30} />
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  );
}