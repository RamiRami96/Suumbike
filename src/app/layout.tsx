import "./globals.css";
import { Montserrat } from "next/font/google";
import Header from "@/app/components/header";

const font = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Suumbike",
  description: "Web app for the dating",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = {
    user: {
      name: 'Ramil Usmanov',
      email: 'ramiramiusmanov1996@gmail.com',
      image: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=178142988471195&height=50&width=50&ext=1692864040&hash=AeT01IymBxPIPs24aOI'
    },
    id: 'clki0bxro0000tzl4f4878uxk'
  }

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
