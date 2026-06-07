import logoAsset from "@/assets/snackwize-logo.png.asset.json";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Snackwize" className={className} />;
}