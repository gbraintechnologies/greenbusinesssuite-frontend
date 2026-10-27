import type { Metadata } from "next";
import { Montserrat, Syne } from "next/font/google";

// global css
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-landing-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Green Business Suite",
  description:
    "The platform for programs, clients, and green growth—built for teams that deliver impact at scale.",
  icons: {
    icon: [
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
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
    <html
      suppressHydrationWarning
      lang="en"
      className={`${montserrat.variable} ${syne.variable}`}
    >
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <meta name="theme-color" content="#0B3D2E" />
      <body className="font-sans antialiased">
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
