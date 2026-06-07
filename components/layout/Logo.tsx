import Image from 'next/image'

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return <Image width={800} height={600} src="/image.png" alt="Snackwize" className={className} />;
}