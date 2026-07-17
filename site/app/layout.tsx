import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keshav Tyagi | Computer Science & Software",
  description:
    "Portfolio of Keshav Tyagi, a computer science student building practical software and intelligent systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
