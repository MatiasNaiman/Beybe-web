import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/lora/wght.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopProvider } from "@/components/shop-provider";
export const metadata: Metadata = {
  title: {
    default: "BEYBE · Pequeños comienzos. Mucho amor.",
    template: "%s · BEYBE",
  },
  description:
    "Ropa y accesorios para bebés. Fabricación propia desde 1998. Venta minorista y mayorista.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/logo.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body>
        <ShopProvider>
          <a className="skip-link" href="#contenido">
            Ir al contenido
          </a>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
