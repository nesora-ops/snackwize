import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { AppHeader } from "@/components/layout/AppHeader";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "#FAFAF8",
        display: "flex",
        flexDirection: "column",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
        boxShadow: "0 0 40px rgba(0,0,0,0.08)",
      }}
    >
      <AppHeader />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "80px", /* space for bottom nav */
        }}
      >
        {children}
      </main>
      <AppBottomNav />
    </div>
  );
}
