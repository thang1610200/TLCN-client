import React from "react";


export default function DetailChapterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main>
                {children}
            </main>
        </>
    );
}
