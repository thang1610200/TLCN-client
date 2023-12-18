import { Navbar } from '@/components/Navbar';
import React from 'react';


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div>
                <div className="flex flex-col w-full h-full ">
                    <div className="flex-1 w-full h-full p-6 pt-20">{children}</div>
                </div>
            </div>
        </>
    );
}
