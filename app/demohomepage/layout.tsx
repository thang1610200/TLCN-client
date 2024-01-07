import { Navbar } from "@/components/Navbar";
import React from "react";


export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar/>
            <div className="w-full h-full overflow-x-hidden scroll-smooth">
                {children}
            </div >
        </>
    );
}
