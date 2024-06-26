import { Navbar } from "@/components/navigation-bar/Navbar";
import React from "react";


export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* <Navbar/> */}
            <div className="w-full h-full overflow-x-hidden overflow-y-hidden scroll-smooth">
                {children}
            </div >
        </>
    );
}
