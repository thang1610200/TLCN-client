import React from "react";
import { Sidebar } from "./components/sidebar";

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="w-screen h-full">
                <div className="border-t">
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
            </div>
        </>
    );
}
