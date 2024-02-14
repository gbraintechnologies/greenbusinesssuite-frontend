import type { Metadata } from "next";
import { Inter } from "next/font/google";

// global css
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mesh Suite Forms",
  description: "Mesh Suite Forms",
};

// Toast Notifications
import { Toaster } from "react-hot-toast";

// RTK
import ReactQueryProvider from "@/lib/ReactQueryProvider/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
