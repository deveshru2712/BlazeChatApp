import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Blob from "@/components/Blob";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "./AuthProvider";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blaze 🔥",
  description:
    "Seamless real-time messaging with Blaze - connect instantly with friends and colleagues",
  keywords: [
    "chat",
    "messaging",
    "real-time",
    "communication",
    "blaze",
    "team chat",
    "friends chat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${bricolage.variable} antialiased transition-colors duration-300 ease-in-out overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen w-screen fixed -z-50 pointer-events-none">
            <Blob />
          </div>
          <AuthProvider>
            <div className="relative z-10 min-h-screen">{children}</div>
          </AuthProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
