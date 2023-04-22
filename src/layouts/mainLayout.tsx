import React from "react";
import Header from "../components/Header/Header";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
