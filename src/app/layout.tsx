import "./globals.css";
import { Montserrat } from "next/font/google";
import Header from "@/app/components/header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

const font = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Tatatia",
  description: "web app for the dating",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <>
          <Header session={session} />
          {children}
        </>
      </body>
    </html>
  );
}
