import { Bebas_Neue, Work_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import { Metadata, Viewport } from "next";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Movie",
  description:
    "Browse trending, popular, and searchable movies powered by TMDB.",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem("reel-index-theme");
                  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var mode = saved === "light" || saved === "dark" ? saved : (prefersDark ? "dark" : "light");
                  if (mode === "dark") {
                    document.documentElement.classList.add("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#0B0F1A] transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className=" min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
