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
import { KeyedMutator } from 'swr';

interface ActionQuestionProps {
    disabled: boolean;
    exercise_token: string;
    token: string;
    isPublished?: boolean;
    mutate: KeyedMutator<any>;
    isCheck?: boolean
}

export const ActionQuestion = ({
    disabled,
    token,
    exercise_token,
    isPublished,
    mutate,
    isCheck
}: ActionQuestionProps) => {
    const router = useRouter();
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/quizz/update-status`,
                {
                    exercise_token,
                    status: isPublished,
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
            if (isPublished) {
                toast.success('Question unpublished');
            } else {
                toast.success('Question published');
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
                `${BACKEND_URL}/quizz/delete-quizz?token=${token}&email=${session.data?.user.email}&exercise_token=${exercise_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success('Question deleted');
            router.refresh();
            router.push(`/instructor/exercise/${exercise_token}`);
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
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading || isCheck}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
