import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import AuthRedirectHandler from "./auth-redirect";
import { Toaster } from "@/components/ui/sonner";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-host-grotesk",
});

export const metadata = {
  title: "DeepLogo AI",
  description:
    "AI-powered logo generator for creating unique and professional designs.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-black hover:bg-gray-800",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={hostGrotesk.variable}>
          <Provider>
            <AuthRedirectHandler>{children}</AuthRedirectHandler>
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
