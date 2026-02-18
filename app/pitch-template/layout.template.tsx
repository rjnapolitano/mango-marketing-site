// Copy this to /app/[brand-slug]/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "{{BRAND_NAME}} x Mango",
  description: "Creator marketing proposal for {{BRAND_NAME}}",
  openGraph: {
    title: "{{BRAND_NAME}} x Mango",
    description: "Creator marketing proposal for {{BRAND_NAME}}",
    url: "https://mangohq.com/{{BRAND_SLUG}}",
    siteName: "Mango",
    images: [{ url: "/mango-logo.png", width: 400, height: 400, alt: "Mango" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "{{BRAND_NAME}} x Mango",
    description: "Creator marketing proposal for {{BRAND_NAME}}",
    images: ["/mango-logo.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
