import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AegisAI - Zero-Trust AI Runtime Firewall',
  description: 'AI security platform with behavioral abuse detection, runtime protection, and zero-trust enforcement for LLM-based systems.',
  // use the same logo file for the favicon; Next.js will automatically emit
  // the appropriate `<link rel="icon" ...>` tags in the <head>.
  icons: {
    icon: '/aegis-logo.png',
    apple: '/apple-icon.png',
    // you can still include additional variants (SVG, mask, etc.) if needed
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
