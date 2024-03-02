'use client';

import qs from 'query-string';
import axios from 'axios';
import { useState } from 'react';

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
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const session = useSession();

    const isModalOpen = isOpen && type === 'deleteMessage';
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `${BACKEND_URL}/message/delete-message`,
                query: {
                    messageId: apiUrl,
                    channelToken: query?.channelToken,
                    serverToken: query?.serverToken,
                    email: session.data?.user.email
                },
            });

            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    },
                }
            );

            onClose();
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
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        The message will be permanently deleted.
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
