import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badia x Mango",
  description: "Creator marketing proposal for Badia",
  openGraph: {
    title: "Badia x Mango",
    description: "Creator marketing proposal for Badia",
    url: "https://mangohq.com/badia",
    siteName: "Mango",
    images: [
      {
        url: "/mango-logo.png",
        width: 400,
        height: 400,
        alt: "Mango",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Badia x Mango",
    description: "Creator marketing proposal for Badia",
    images: ["/mango-logo.png"],
  },
};

export default function BadiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
