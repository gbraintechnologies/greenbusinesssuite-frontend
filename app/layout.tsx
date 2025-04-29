import type { Metadata } from "next";

import { Inter } from "next/font/google";

// global css
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
import { BsCloudSleet } from "react-icons/bs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="favicon/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff"></meta>
      <body className={inter.className}>
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
