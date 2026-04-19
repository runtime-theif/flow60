import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AppManager from "@/components/AppManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Flow60 — 60 Day Transformation",
  description: "A behavior reinforcement system. Less input, more output. Less thinking, more doing.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0a0a0f",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.variable}>
        <AppManager />
        {children}
        <Navigation />
      </body>
    </html>
  );
}
