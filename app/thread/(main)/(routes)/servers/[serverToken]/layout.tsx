import getSession from '@/app/actions/getSession';
import { useDetailServer } from '@/app/hook/useDetailServer';
import LoadingModal from '@/components/modal/loading-modal';
import { ServerSidebar } from '@/components/server/server-sidebar';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverToken: string };
}) => {
    const session = await getSession();

    try {
        await axios.get(
            `${BACKEND_URL}/thread/check-user?serverToken=${params.serverToken}&email=${session?.user.email}`,
            {
                headers: {
                    Authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }
    catch {
        redirect('/thread');
    }

    return (
        <>
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverToken={params.serverToken} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
        </>
    );
};

export default ServerIdLayout;
