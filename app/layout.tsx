import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Brand",
  description: "Welcome to our brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
