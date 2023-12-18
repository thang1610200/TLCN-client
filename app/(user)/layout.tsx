import { Metadata } from 'next';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/sidebar-nav';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Forms',
    description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Change password',
        href: '/change-password',
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default async function SettingsLayout({
    children,
}: SettingsLayoutProps) {
    return (
        <>
            <Navbar />
            <div className="hidden p-10 pb-16 space-y-6 md:block">
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    );
}
