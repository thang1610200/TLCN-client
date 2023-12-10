import React from 'react';
import Navbar from '../../components/navbar';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/sidebar-nav';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="w-screen h-screen">
                <div className="flex flex-col w-full h-full ">
                    <div className="flex-1 w-full h-full p-6 pt-20">{children}</div>
                </div>
            </div>
        </>
    );
}
