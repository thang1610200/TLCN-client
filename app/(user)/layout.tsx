import { Metadata } from 'next';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/sidebar-nav';
import { Navbar } from '@/components/navigation-bar/Navbar';

export const metadata: Metadata = {
    title: 'Forms',
    description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
    {
        title: 'Thông tin',
        href: '/profile',
    },
    {
        title: 'Đổi mật khẩu',
        href: '/change-password',
    },
    {
        title: 'Khóa học',
        href: '/course-access'
    }
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default async function SettingsLayout({
    children,
}: SettingsLayoutProps) {
    return (
        <>
            <div className="hidden w-full h-full p-10 pt-0 pb-16 space-y-6 md:block">
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-40">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    );
}
