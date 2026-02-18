import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nomad Cosmetics x Mango",
  description: "Social media management and creator marketing proposal for Nomad Cosmetics",
  openGraph: {
    title: "Nomad Cosmetics x Mango",
    description: "Social media management and creator marketing proposal for Nomad Cosmetics",
    url: "https://mangohq.com/nomad",
    siteName: "Mango",
    images: [{ url: "/mango-logo.png", width: 400, height: 400, alt: "Mango" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nomad Cosmetics x Mango",
    description: "Social media management and creator marketing proposal for Nomad Cosmetics",
    images: ["/mango-logo.png"],
  },
};

export default function NomadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
