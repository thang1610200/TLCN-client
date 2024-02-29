import { ModalProvider } from '@/components/provider/modal-provider';
import { SocketProvider } from '@/components/provider/socket-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';
import React from 'react';

export default function ThreadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-[#313338]">
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                storageKey="discord-theme"
            >
                <SocketProvider>
                    <ModalProvider />
                    {children}
                </SocketProvider>
            </ThemeProvider>
        </div>
    );
}
