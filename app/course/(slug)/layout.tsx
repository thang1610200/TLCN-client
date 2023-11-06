import React from "react";


export default function CreateCourseLayout({
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
