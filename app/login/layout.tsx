import React from 'react'


export default function layoutLogin({
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
