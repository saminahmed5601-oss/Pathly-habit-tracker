import AntigravityPet from "@/components/AntigravityPet";
import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pathly.app'),
  title: 'Pathly - Cozy Daily Progress & Milestone Tracker',
  description: 'A clean, cute, and cheat-proof daily life & milestone progress tracker. Build genuine habits, stay accountable with friends, and forge your unique path.',
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: 'Pathly - Cozy Daily Progress & Milestone Tracker',
    description: 'A clean, cute, and cheat-proof daily life & milestone progress tracker. Build genuine habits, stay accountable with friends, and forge your unique path.',
    url: 'https://pathly.app',
    siteName: 'Pathly',
    images: [
      {
        url: '/icon.jpg',
        width: 800,
        height: 800,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pathly',
    description: 'A clean, cute, and cheat-proof daily life & milestone progress tracker.',
    images: ['/icon.jpg'],
  },
  appleWebApp: {
    title: 'Pathly',
    statusBarStyle: 'black-translucent',
  },
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
          <AntigravityPet />
        </AppProvider>
      </body>
    </html>
  );
}
