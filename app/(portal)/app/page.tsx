import { redirect } from "next/navigation";

// /app → /app/menu
export default function AppRootPage() {
  redirect("/app/menu");
}
