import React from 'react';


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="">
                {/* <Separator className="my-6" /> */}
                <div className="">
                    {/* <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside> */}
                    <div className="">{children}</div>
                </div>
            </div>
        </>
    );
}
