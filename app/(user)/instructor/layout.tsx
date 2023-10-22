import React from "react";


export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main   >
                {children}
            </main>
        </>
    );
}
