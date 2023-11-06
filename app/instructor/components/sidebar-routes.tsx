'use client';

import { BarChart, Compass, Layout, List } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { SidebarItem } from './sidebar-item';

const routes = [
    {
        icon: List,
        label: 'Courses',
        href: '/instructor/course',
    },
    {
        icon: BarChart,
        label: 'Analytics',
        href: '#',
    },
];

export const SidebarRoutes = () => {
    const pathname = usePathname();

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
