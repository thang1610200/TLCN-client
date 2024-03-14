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
import qs from "query-string";

interface ActionQuestionProps {
    disabled: boolean;
    exercise_token: string;
    token: string;
    isPublished?: boolean;
    mutates: KeyedMutator<any>;
    isCheck?: boolean;
    course_slug: string;
    chapter_token: string;
}

export const ActionQuestion = ({
    disabled,
    token,
    exercise_token,
    isPublished,
    mutates,
    isCheck,
    course_slug,
    chapter_token
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
                    quiz_token:token,
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
            if (isPublished) {
                toast.success('Question unpublished');
            } else {
                toast.success('Question published');
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

            // const urlExercise = qs.stringifyUrl({
            //     url: `${BACKEND_URL}/exercise/detail-exercise`,
            //     query: {
            //         email: session.data?.user.email,
            //         token: exercise_token,
            //         course_slug,
            //         chapter_token
            //     }
            // });

            const url = qs.stringifyUrl({
                url: `${BACKEND_URL}/quizz/delete-quizz`,
                query: {
                    exercise_token,
                    quiz_token:token,
                    email: session.data?.user.email,
                    course_slug,
                    chapter_token
                }
            });

            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            //mutate([urlExercise, session.data?.backendTokens.accessToken]);
            toast.success('Question deleted');
            router.refresh();
            router.push(`/instructor/course/${course_slug}/chapter/${chapter_token}/exercise/${exercise_token}`);
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
