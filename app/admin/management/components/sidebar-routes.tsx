'use client';

import { BarChart, List, Book } from 'lucide-react';

import { SidebarItem } from './sidebar-item';

const routes = [
    {
        icon: List,
        label: 'Management Course',
        href: '#',
    },
    {
        icon: Book,
        label: 'Management Exercise',
        href: '#',
    },
    {
        icon: BarChart,
        label: 'Management User',
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
