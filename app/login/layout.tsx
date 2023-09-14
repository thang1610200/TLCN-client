import React from 'react'
import Navbar from '../home/Navbar'

export default function layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <body>{children}</body>
        </>
    )
}
