import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./ui/context/User_Context";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ikawa y'Uburundi",
  description: "Ikawa y'Uburundi management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased`}
      >
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
