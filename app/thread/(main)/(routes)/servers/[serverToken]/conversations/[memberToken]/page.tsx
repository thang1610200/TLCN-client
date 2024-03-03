import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import getSession from '@/app/actions/getSession';
import { ChatMessages } from '@/components/chat/chat-message';
import { Conversation } from '@/app/types';

interface MemberIdPageProps {
    params: {
        memberToken: string;
        serverToken: string;
    };
    searchParams: {
        video?: boolean;
    };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const session = await getSession();

    try {
        var conversation = await axios.post(
            `${BACKEND_URL}/thread/create-conversation`,
            {
                emailOwner: session?.user.email,
                memberTokenGuest: params.memberToken,
                serverToken: params.serverToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${session?.backendTokens.accessToken}`,
                },
            }
        );
    } catch {
        return redirect(`/thread/servers/${params.serverToken}`);
    }

    if (!conversation.data) {
        return redirect(`/thread/servers/${params.serverToken}`);
    }

    const data: Conversation = conversation.data; 

    const { memberOwner, memberGuest } = data;

    const otherMember =
        memberOwner.user.email === session?.user.email
            ? memberGuest
            : memberOwner;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.user.image}
                name={otherMember.user.name}
                serverToken={params.serverToken}
                type="conversation"
            />
            {/* {searchParams.video && (
                <MediaRoom chatId={conversation.id} video={true} audio={true} />
            )} */}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={memberOwner}
                        name={otherMember.user.name}
                        chatToken={data.id}
                        type="conversation"
                        paramKey="conversationId"
                        paramValue={data.id}
                        socketUrl="message/edit-conversation"
                        socketQuery={{
                            conversationId: data.id,
                        }}
                        apiUrl='message/pagination-conversation'
                    />
                    <ChatInput
                        name={otherMember.user.name}
                        type="conversation"
                        apiUrl="message/create-direct-message"
                        query={{
                            conversationId: data.id,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default MemberIdPage;
