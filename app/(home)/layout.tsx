import { Navbar } from '@/components/navigation-bar/Navbar';
import React from 'react';
import SideBar from './components/SideBar';


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center w-screen h-screen '>
                <SideBar/>
                <div className="flex items-center justify-center w-full h-full pt-20">{children}</div>
            </div>
        </>
    );
}
