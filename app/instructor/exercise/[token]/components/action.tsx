'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { useConfettiStore } from '@/app/hook/useConfettiStore';
import { KeyedMutator } from 'swr';

interface ActionsProps {
    disabled: boolean;
    token: string;
    isOpen?: boolean;
    mutate: KeyedMutator<any>;
}

export const Actions = ({
    disabled,
    token,
    isOpen,
    mutate,
}: ActionsProps) => {
    const router = useRouter();
    const session = useSession();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/exercise/update-exercise`,
                {
                    isOpen,
                    token,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (isOpen) {
                toast.success('Exercise unpublished');
            } else {
                toast.success('Exercise published');
                confetti.onOpen();
            }
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(
                `${BACKEND_URL}/course/delete-course?slug=${token}&email=${session.data?.user.email}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success('Exercise deleted');
            router.refresh();
            router.push(`/instructor/exercise`);
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isOpen ? 'Close' : 'Open'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
