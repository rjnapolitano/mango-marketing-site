import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mango",
  description: "A creative agency built for the future of influencer marketing",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Mango",
    description: "A creative agency built for the future of influencer marketing",
    url: "https://mangohq.com",
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
    title: "Mango",
    description: "A creative agency built for the future of influencer marketing",
    images: ["/mango-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1209967218003909');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1209967218003909&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
