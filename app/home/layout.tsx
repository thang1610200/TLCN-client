import React from 'react'
import Navbar from './Navbar'
import Main from './Main'
import Courses from './Courses'


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
    <>
        <nav>About NavBar</nav>
        <main>
            <Navbar />
            <Main />
            <Courses />
        </main>
    </>
  )
}
