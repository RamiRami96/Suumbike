import "@/app/globals.css";
import { Montserrat } from "next/font/google";
import { NextAuthProvider } from "./providers";
import Header from "@/modules/layout/components/header";
import { NotificationProvider } from "@/modules/layout/context/notificationContext";
import Notification from "@/modules/layout/components/notification";

const font = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Söyembikä",
  description: "Web app for the dating",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <NextAuthProvider>
          <NotificationProvider>
            <Notification />
            <Header />
            {children}
          </NotificationProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
