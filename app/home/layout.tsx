import React from 'react';
import SideBar from '../../components/navigation/SideBar';
import { PaginationCourse } from '@/components/pagination/home-pagination';
import ChatBot from '@/components/chat-bot/chat-bot';


export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ChatBot/>
            <div className='flex items-center justify-center w-screen h-screen pt-10'>
                <div className="flex items-center justify-center w-full h-full ">{children}</div>
            </div>
            <PaginationCourse />
        </>
    );
}
