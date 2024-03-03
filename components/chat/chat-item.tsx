'use client';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { UserAvatar } from '@/components/user-avatar';
import { ActionTooltip } from '@/components/action-tooltip';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from '@/app/hook/useModalStore';
import { Member, MemberRole, User } from '@/app/types';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/constant';

interface ChatItemProps {
    id: string;
    content: string;
    member: Member;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember?: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
    type: 'channel' | 'conversation';
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
    type
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const session = useSession();

    const onMemberClick = () => {
        if (member.token === currentMember?.token) {
            return;
        }

        router.push(`/thread/servers/${params?.serverToken}/conversations/${member.token}`);
    };

    const handleDeleteMessage = () => {
        let url = "";
        let data = {};

        if(type === 'channel') {
            url = 'message/delete-message';
            data = {
                ...socketQuery,
                messageId: id,
            }
        }
        else if(type === 'conversation') {
            url = 'message/delete-conversation';
            data = {
                ...socketQuery,
                directMessageId: id,
            }
        }

        onOpen('deleteMessage',{
            apiUrl: url,
            query: data
        })
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keyDown', handleKeyDown);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${BACKEND_URL}/${socketUrl}`,
            });

            let data = {};

            if(type === 'channel') {
                data = {
                    content: values.content,
                    email: session.data?.user.email,
                    messageId: id,
                    ...socketQuery
                }
            }else if (type === 'conversation') {
                data = {
                    content: values.content,
                    email: session.data?.user.email,
                    directMessageId: id,
                    ...socketQuery
                }
            }

            await axios.patch(
                url,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    },
                }
            );

            form.reset();
            setIsEditing(false);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        form.reset({
            content: content,
        });
    }, [content]);

    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember?.role === MemberRole.Admin;
    const isModerator = currentMember?.role === MemberRole.Morderator;
    const isOwner = currentMember?.token === member.token;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                    onClick={onMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition"
                >
                    <UserAvatar src={member.user.image} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                onClick={onMemberClick}
                                className="font-semibold text-sm hover:underline cursor-pointer"
                            >
                                {member.user.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                'text-sm text-zinc-600 dark:text-zinc-300',
                                deleted &&
                                    'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder="Edited message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isLoading}
                                    size="sm"
                                    variant="primary"
                                >
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={handleDeleteMessage}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
};
