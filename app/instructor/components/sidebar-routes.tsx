'use client';

import { BarChart, List, Book, User } from 'lucide-react';

import { SidebarItem } from './sidebar-item';

const routes = [
    {
        icon: List,
        label: 'Khóa học',
        href: '/instructor/course',
    },
    // {
    //     icon: Book,
    //     label: 'Bài tập',
    //     href: '/instructor/exercise',
    // },
    {
        icon: User,
        label: 'Người dùng',
        href: '/instructor/user'
    },
    {
        icon: BarChart,
        label: 'Biểu đồ',
        href: '/instructor/analytic',
    },
];

export const SidebarRoutes = () => {
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};
