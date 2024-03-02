'use client';

import { useDetailChannel } from '@/app/hook/useChannel';
import { ChannelType } from '@/app/types';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-message';
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
    const { channel, isLoading, error } = useDetailChannel(
        params.channelToken,
        session.data?.backendTokens.accessToken
    );

    const member = channel?.server.members.find((data) => {
        return data.user.email === session.data?.user.email;
    });

    if (error) {
        return router.push('/thread');
    }

    if (isLoading) {
        return <LoadingModal />;
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel?.name}
                serverToken={channel?.server.token}
                type="channel"
            />
            {channel?.type === ChannelType.Text && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatToken={channel.token}
                        type="channel"
                        socketUrl="message"
                        socketQuery={{
                            channelToken: channel?.token,
                            serverToken: channel.server.token,
                        }}
                        paramKey="channelId"
                        paramValue={channel.token}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="message/create-message"
                        query={{
                            channelToken: channel.token,
                            serverToken: channel.server.token
                        }}
                    />
                </>
            )}
            {/* {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} video={false} audio={true} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} video={true} audio={true} />
            )} */}
        </div>
    );
};

export default ChannelIdPage;
