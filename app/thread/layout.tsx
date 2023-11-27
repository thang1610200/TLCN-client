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
            <div className="flex space-y-6 ">
                {/* <Separator className="my-6" /> */}
                <div className="flex flex-col ">
                    {/* <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside> */}
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    );
}
