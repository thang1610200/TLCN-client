'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/app/hook/useModalStore';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import queryString from 'query-string';
import { mutate } from 'swr';

export const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const session = useSession();
    const isModalOpen = isOpen && type === 'deleteServer';
    const { server } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const url = queryString.stringifyUrl({
                url: `${BACKEND_URL}/thread/delete-server`,
                query: {
                    serverToken: server?.token,
                    email: session.data?.user.email
                }
            });

            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    },
                }
            );

            mutate([`${BACKEND_URL}/thread/get-server?email=${session.data?.user.email}`,session.data?.backendTokens.accessToken]);
            onClose();
            router.refresh();
            router.push('/thread');
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">
                            {server?.name}
                        </span>{' '}
                        will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
