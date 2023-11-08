import React from "react";


export default function DetailCourseLayout({
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
