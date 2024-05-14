'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';

interface MediaRoomProps {
    chatToken: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatToken, video, audio }: MediaRoomProps) => {
    const session = useSession();
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!session.data?.user.name) return;

        const name = session.data?.user.name;

        (async () => {
            try {
                const resp = await fetch(
                    `${BACKEND_URL}/thread/livekit?room=${chatToken}&username=${name}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        }
                    }
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                toast.error('Something went wrong');
            }
        })();
    }, [session.data?.user.name, chatToken, session.data?.backendTokens.accessToken]);

    if (token === '') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};
