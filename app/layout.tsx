import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import Navbar from "@/components/Navbar";
import Providers from "@/Providers";
import { UIProvider } from "@/context/UIContext";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opaira – Connect, Learn & Grow through Conversations",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",},
  description:
    "Opaira is a global platform where people connect via real-time voice and video to improve language, build confidence, and make meaningful conversations.",
  keywords: [
    "Opaira",
    "language learning",
    "video chat app",
    "talk to strangers",
    "improve English",
    "practice speaking",
    "voice chat",
    "conversation platform",
  ],
  authors: [{ name: "Kishor Naveen", url: "https://opaira.vercel.app" }],
  creator: "Kishor Naveen",
  publisher: "Opaira",
  openGraph: {
    title: "Opaira – Connect, Learn & Grow through Conversations",
    description:
      "Opaira helps you improve communication and confidence by connecting with real people around the world through live conversations.",
    url: "https://opaira.vercel.app",
    siteName: "Opaira",
    images: [
      {
        url: "/opaira-og-image.png", // replace with your OG image path
        width: 1200,
        height: 630,
        alt: "Opaira Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opaira – Connect, Learn & Grow through Conversations",
    description:
      "Meet people, practice languages, and build confidence with Opaira.",
    creator: "@opaira", // optional if you have a Twitter handle
    images: ["/opaira-og-image.png"], // same as OG
  },
  metadataBase: new URL("https://opaira.vercel.app"),
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
        <UIProvider>
  

            <Navbar />
            <Providers>
            {children}
            </Providers>
            </UIProvider>
         
        </SessionProvider>
        
      </body>
    </html>
  );
}
