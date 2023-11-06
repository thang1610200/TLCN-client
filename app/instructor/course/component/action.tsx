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
    slug: string;
    isPublished?: boolean;
    mutate: KeyedMutator<any>;
}

export const Actions = ({
    disabled,
    slug,
    isPublished,
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
                `${BACKEND_URL}/course/update-status`,
                {
                    status: isPublished,
                    slug,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (isPublished) {
                toast.success('Course unpublished');
            } else {
                toast.success('Course published');
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
                `${BACKEND_URL}/course/delete-course?slug=${slug}&email=${session.data?.user.email}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success('Course deleted');
            router.refresh();
            router.push(`/instructor/course`);
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
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
