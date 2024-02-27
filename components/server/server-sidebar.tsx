"use client";

import { redirect, useRouter } from 'next/navigation';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';
import { ChannelType, MemberRole, Server } from '@/app/types';
import { useSession } from 'next-auth/react';
import { useDetailServer } from '@/app/hook/useDetailServer';
import LoadingModal from '../modal/loading-modal';

interface ServerSidebarProps {
    serverToken: string;
}

const iconMap = {
    [ChannelType.Text]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.Audio]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.Video]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.Guest]: null,
    [MemberRole.Morderator]: (
        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.Admin]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = ({ serverToken }: ServerSidebarProps) => {
    const session = useSession();
    const router = useRouter();
    const {server, isLoading, error} = useDetailServer(serverToken, session.data?.backendTokens.accessToken, session.data?.user.email);

    const textChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.Text
    );
    const audioChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.Audio
    );
    const videoChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.Video
    );
    const members = server?.members.filter(
        (member) => member.user.email !== session.data?.user.email
    );

    const role = server?.members.find(
        (member) =>member.user.email === session.data?.user.email
    )?.role;

    if(isLoading){
        return <LoadingModal />
    }

    if(error){
        router.push('/thread');
    }

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.token,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.token,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.token,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.user.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.Text}
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.Audio}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.Video}
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
