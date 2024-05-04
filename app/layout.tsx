import type { Metadata } from "next";
import { Inter } from "next/font/google";

// global css
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mesh Suite",
  description: "Mesh Suite",
};

// Toast Notifications
import { Toaster } from "react-hot-toast";

// RTK
import ReactQueryProvider from "@/lib/ReactQueryProvider/ReactQueryProvider";

// context provider
import AdminContextProvider from "@/lib/AdminContextProvider/AdminContextProvider";
import UserContextProvider from "@/lib/UserContextProvider/UserContextProvider";
import AuthContextProvider from "@/lib/AuthContextProvider/AuthContextProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
              <UserContextProvider>{children}</UserContextProvider>
              <Toaster position="top-center" reverseOrder={true} />
            </AdminContextProvider>
          </AuthContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
