

import { Navbar } from '@/components/Navbar';
import React from 'react';

export default function CreateCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <Navbar />
            <div className="hidden p-10 pb-16 space-y-6 md:block">
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 my-8">
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
