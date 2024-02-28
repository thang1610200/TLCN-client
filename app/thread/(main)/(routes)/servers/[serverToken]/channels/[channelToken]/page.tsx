"use client";

import { useDetailChannel } from '@/app/hook/useChannel';
import { ChannelType } from '@/app/types';
import { ChatHeader } from '@/components/chat/chat-header';
import LoadingModal from '@/components/modal/loading-modal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ChannelIdPageProps {
    params: {
        serverToken: string;
        channelToken: string;
    };
}

const ChannelIdPage = ({ params }: ChannelIdPageProps) => {
    const session = useSession();
    const router = useRouter();
    const { channel, isLoading, error } = useDetailChannel(params.channelToken, session.data?.backendTokens.accessToken);

    if(error) {
        return router.push('/thread');
    }

    if(isLoading) {
        return <LoadingModal />
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel?.name}
                serverToken={channel?.token}
                type="channel"
            />
            {/* {channel?.type === ChannelType.Text && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} video={false} audio={true} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} video={true} audio={true} />
            )} */}
        </div>
    );
};

export default ChannelIdPage;
