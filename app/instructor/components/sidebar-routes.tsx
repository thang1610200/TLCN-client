'use client';

import { BarChart, List, Book, User } from 'lucide-react';

import { SidebarItem } from './sidebar-item';

const routes = [
    {
        icon: List,
        label: 'Courses',
        href: '/instructor/course',
    },
    {
        icon: Book,
        label: 'Exercises',
        href: '/instructor/exercise',
    },
    {
        icon: User,
        label: 'Users',
        href: '/instructor/user'
    },
    {
        icon: BarChart,
        label: 'Analytics',
        href: '#',
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
