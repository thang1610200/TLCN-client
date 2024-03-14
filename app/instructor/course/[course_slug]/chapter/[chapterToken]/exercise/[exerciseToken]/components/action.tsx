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
import { KeyedMutator, mutate } from 'swr';
import qs from 'query-string';

interface ActionsProps {
    disabled: boolean;
    token: string;
    isOpen?: boolean;
    mutates: KeyedMutator<any>;
    isCheck?: boolean;
    course_slug: string;
    chapter_token: string;
}

export const Actions = ({
    disabled,
    token,
    isOpen,
    mutates,
    isCheck,
    course_slug,
    chapter_token
}: ActionsProps) => {
    const router = useRouter();
    const session = useSession();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/exercise/status-exercise`,
                {
                    status: isOpen,
                    token,
                    email: session.data?.user.email,
                    course_slug,
                    chapter_token
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
            mutates();
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

            const url = qs.stringifyUrl({
                url: `${BACKEND_URL}/exercise/delete-exercise`,
                query: {
                    email: session.data?.user.email,
                    token,
                    course_slug,
                    chapter_token
                }
            })

            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            //mutate([`${BACKEND_URL}/chapter/find-chapter?course_slug=${course_slug}&email=${session.data?.user.email}&token=${chapter_token}`,session.data?.backendTokens.accessToken]);
            toast.success('Exercise deleted');
            router.refresh();
            router.push(
                `/instructor/course/${course_slug}/chapter/${chapter_token}`
            );
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
                disabled={disabled || isLoading || isCheck}
                variant="outline"
                size="sm"
            >
                {isOpen ? 'Close' : 'Open'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading || isCheck}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
