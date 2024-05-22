import {Navbar} from '@/components/navigation-bar/Navbar';
import React from 'react';
import SideBar from '../../components/navigation-bar/SideBar';
import { PaginationCourse } from './components/pagination';


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center w-screen h-screen pt-10'>
                <div className="flex items-center justify-center w-full h-full ">{children}</div>
            </div>
            <PaginationCourse />
        </>
    );
}
