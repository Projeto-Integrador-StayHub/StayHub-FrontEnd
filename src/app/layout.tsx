import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../app/styles/globals.scss";
import Link from 'next/link';
import TelaAnuncio from "../app/telaAnuncio/page";
import TelaPerfil from "../app/telaPerfil/page";
import TelaPerfilDono from "../app/telaPerfilDono/page";
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
