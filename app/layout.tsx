import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'HUMMELLO - AI Music Generation',
  description: 'Transform your humming into beautiful music with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gray-900 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}