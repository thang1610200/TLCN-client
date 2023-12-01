"use client"

import React from 'react';



export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
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
