import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clai | Learn anything in 3 minutes a day",
  description: "A mobile app that helps you learn anything in 3 minutes a day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex w-full justify-center`}
      >
        <div className="max-w-lg min-w-lg border border-gray-400 font-[family-name:var(--font-geist-sans)]">
          {children}
        </div>
      </body>
    </html>
  );
}
