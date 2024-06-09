'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from '@/components/ui/separator';

import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';

import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useGetServer } from '@/app/hook/useGetServer';
import LoadingModal from '../modal/loading-modal';
import SideBar from './SideBar';

export const NavigationSidebar = () => {
    const session = useSession();
    const {
        data: servers = [],
        isLoading,
        error,
    } = useGetServer(
        session.data?.user.email,
        session.data?.backendTokens.accessToken
    );

    if (error) {
        toast.error('Something went wrong');
    }

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {
                    isLoading && <LoadingModal />
                }
                {servers.map((server) => (
                    <div key={server.token} className="mb-4">
                        <NavigationItem
                            serverToken={server.token}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ModeToggle />
                <SideBar/>
                
            </div>
        </div>
    );
};
