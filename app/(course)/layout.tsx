

import { Navbar } from '@/components/navigation-bar/Navbar';
import React from 'react';

export default function CreateCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-full">
            <Navbar />
            <div className="flex items-center justify-center">{children}</div>
        </div>
    );
}
