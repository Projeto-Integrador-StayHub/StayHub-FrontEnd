import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../app/styles/globals.scss";
import Link from 'next/link';
import TelaAnuncio from "../app/telaAnuncio/page";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children} 
        
      </body>
    </html>
  );
}
