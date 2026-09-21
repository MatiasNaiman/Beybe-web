import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/lora/wght.css";
import "./globals.css";
import "./home.css";
import "./campaign.css";
import "./shop.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopProvider } from "@/components/shop-provider";
import { catalog } from "@/lib/catalog";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff9f1",
};
export const metadata: Metadata = {
  title: {
    default: "BEYBE · Vistiendo al futuro",
    template: "%s · BEYBE",
  },
  description:
    "Ropa y accesorios para bebés. Fabricación propia desde 1998. Venta minorista y mayorista.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/logo.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDemo = (await catalog.list()).some((p) => p.demo);
  return (
    <html lang="es-AR" data-scroll-behavior="smooth">
      <body>
        <ShopProvider>
          <a className="skip-link" href="#contenido">
            Ir al contenido
          </a>
          <Header />
          {isDemo && (
            <div className="demo-banner">
              <strong>Tienda demostrativa</strong>
              <span>Artículos, precios y stock ficticios · Sin cobros</span>
            </div>
          )}
          <main id="contenido">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
