import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../app/styles/globals.scss";
import Link from 'next/link';
import TelaAnuncio from "../app/telaAnuncio/page";
import TelaPerfil from "../app/telaPerfil/page";
import TelaAnuncioQuarto from "../app/telaAnuncioQuarto/page";
import ListaQuarto from "../app/listaDeQuartos/page"
import telaPagamento from "../app/telaPagamento/page";
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
