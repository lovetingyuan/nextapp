import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '../components/ThemeProvider'
// import Script from 'next/script'
// import { track } from '@/lib/utils'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'apps made by tingyuan',
  description: 'apps made by tingyuan',
}

// function initAmplitude() {
//   // window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }))
//   // @ts-expect-error ignore
//   window.amplitude.init('3f92a46a7510070dce089235b9429001', {
//     fetchRemoteConfig: true,
//     autocapture: true,
//     appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
//   })
//   document.addEventListener(
//     'click',
//     evt => {
//       const properties = {}
//       let eventType = ''
//       // @ts-expect-error ignore
//       for (const attr of evt.target.attributes) {
//         if (attr.name === 'data-amp-track') {
//           eventType = attr.value
//         } else if (attr.name.startsWith('data-amp-track-')) {
//           const name = attr.name.slice(15)
//           if (name) {
//             // @ts-expect-error ignore
//             properties[name] = attr.value
//           }
//         }
//       }
//       if (eventType) {
//         track(eventType, properties)
//       }
//     },
//     {
//       capture: true,
//     }
//   )
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative max-w-7xl mx-auto`}
      >
        {/* <Script
          id="amplitude-script"
          src="https://cdn.amplitude.com/script/3f92a46a7510070dce089235b9429001.js"
          strategy="beforeInteractive"
        />
        <Script id="amplitude-init">{`(${initAmplitude}())`}</Script> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SonnerToaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
