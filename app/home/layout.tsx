import React from "react";
import Navbar from "../../components/Navbar";
import Main from "./Main";
import Courses from "./Courses";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <Navbar />
        <Main />
        <Courses />
        { children }
      </main>
    </>
  );
}
