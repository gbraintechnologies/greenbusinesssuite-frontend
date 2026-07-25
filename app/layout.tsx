import type { Metadata } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";

// global css
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mesh Suite",
  description: "Mesh Suite",
  icons: {
    icon: "/favicon.ico",
  },
};

// Toast Notifications
import { Toaster } from "sonner";

// RTK
import ReactQueryProvider from "@/lib/ReactQueryProvider/ReactQueryProvider";

// context provider
import AdminContextProvider from "@/lib/AdminContextProvider/AdminContextProvider";
import UserContextProvider from "@/lib/UserContextProvider/UserContextProvider";
import AuthContextProvider from "@/lib/AuthContextProvider/AuthContextProvider";
import CompanyContextProvider from "@/lib/CompanyContextProvider/CompanyContextProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={sans.variable}>
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <meta name="theme-color" content="#ffffff"></meta>
      <body className={`${sans.className} font-sans antialiased`}>
        <ReactQueryProvider>
          <AuthContextProvider>
            <AdminContextProvider>
              <CompanyContextProvider>
                <UserContextProvider>{children}</UserContextProvider>
              </CompanyContextProvider>
              <Toaster
                toastOptions={{
                  duration: 2000,
                  closeButton: true,
                }}
                duration={2000}
                closeButton
                position="top-right"
              />
            </AdminContextProvider>
          </AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
