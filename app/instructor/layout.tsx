import React from "react";
import { Sidebar } from "./components/sidebar";
import { Navbar } from "@/components/Navbar";


export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="h-full">
                <Navbar />
                <div className="border-t pt-14">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Sidebar />
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
