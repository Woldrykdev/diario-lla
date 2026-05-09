export const dynamic = "force-dynamic";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "La Libertad Avanza Saladillo",
  description: "Portal de noticias institucional",
  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main style={{ minHeight: "80vh" }}>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
