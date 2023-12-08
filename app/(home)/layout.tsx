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
            <div className="hidden p-10 pb-16 space-y-6 md:block">
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 my-8">
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    );
}
