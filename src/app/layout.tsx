import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pathly - Cozy Daily Progress & Milestone Tracker',
  description: 'A clean, cute, and cheat-proof daily life & milestone progress tracker. Build genuine habits, stay accountable with friends, and forge your unique path.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
