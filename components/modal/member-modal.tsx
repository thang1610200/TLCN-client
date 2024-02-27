'use client';

import axios from 'axios';
import qs from 'query-string';
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/app/hook/useModalStore';
import { MemberRole, Server } from '@/app/types';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
    const router = useRouter();
    const session = useSession();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState('');

    const isModalOpen = isOpen && type === 'members';
    const { server } = data as { server: Server };

    const onKick = async (emailMember: string) => {
        try {
            setLoadingId(emailMember);
            const url = qs.stringifyUrl({
                url: `${BACKEND_URL}/thread/kick-member`,
                query: {
                    serverToken: server?.token,
                    email: session.data?.user.email,
                    emailMember
                },
            });

            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            mutate([`${BACKEND_URL}/thread/detail-server?serverToken=${server?.token}&email=${session.data?.user.email}`,session.data?.backendTokens.accessToken]);
            toast.success('Kick Success');
            router.refresh();
            onOpen('members', { server: response.data });
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoadingId('');
        }
    };

    const onRoleChange = async (emailMember: string, role: MemberRole) => {
        try {
            setLoadingId(emailMember);

            const response = await axios.patch(
                `${BACKEND_URL}/thread/update-role`,
                {
                    serverToken: server?.token,
                    email: session.data?.user.email,
                    emailMember,
                    role
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            mutate([`${BACKEND_URL}/thread/detail-server?serverToken=${server?.token}&email=${session.data?.user.email}`,session.data?.backendTokens.accessToken]);
            toast.success('Role Updated');
            router.refresh();
            onOpen('members', { server: response.data });
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoadingId('');
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-2 mb-6"
                        >
                            <UserAvatar src={member.user.image} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.user.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.user.email}
                                </p>
                            </div>
                            {server.user.email !== member.user.email &&
                                loadingId !== member.user.email && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-4 w-4 text-zinc-500" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2" />
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.user.email,
                                                                        MemberRole.Guest
                                                                    )
                                                                }
                                                            >
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Guest
                                                                {member.role ===
                                                                    'GUEST' && (
                                                                    <Check className="h-4 w-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.user.email,
                                                                        MemberRole.Morderator
                                                                    )
                                                                }
                                                            >
                                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                                Moderator
                                                                {member.role ===
                                                                    'MODERATOR' && (
                                                                    <Check className="h-4 w-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onKick(member.user.email)
                                                    }
                                                >
                                                    <Gavel className="h-4 w-4 mr-2" />
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            {loadingId === member.user.email && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
