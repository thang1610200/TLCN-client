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
import { KeyedMutator, mutate } from 'swr';
import LoadingModal from '@/components/modal/loading-modal';

interface LessonActionsProps {
    disabled: boolean;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    isPublished: boolean;
    isPreview: boolean;
    mutates: KeyedMutator<any>;
    coursePublished?: boolean;
}

export const LessonActions = ({
    disabled,
    course_slug,
    chapter_token,
    lesson_token,
    isPublished,
    isPreview,
    mutates,
    coursePublished
}: LessonActionsProps) => {
    const router = useRouter();
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/lesson/update-status`,
                {
                    status: isPublished,
                    course_slug: course_slug,
                    chapter_token,
                    lesson_token,
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
                toast.success('Lesson unpublished');
            } else {
                toast.success('Lesson published');
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

            await axios.delete(
                `${BACKEND_URL}/lesson/delete-lesson?course_slug=${course_slug}&chapter_token=${chapter_token}&email=${session.data?.user.email}&lesson_token=${lesson_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            //mutate([`${BACKEND_URL}/chapter/find-chapter?course_slug=${course_slug}&email=${session.data?.user.email}&token=${chapter_token}`,session.data?.backendTokens.accessToken]);
            toast.success('Lesson deleted');
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

    const onPreview = async () => {
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/lesson/update-preview`,
                {
                    status: isPreview,
                    course_slug: course_slug,
                    chapter_token,
                    lesson_token,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Lesson updated');
            mutates();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    if(isLoading){
        return (<LoadingModal />);
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onPreview}
                disabled={disabled || isLoading || coursePublished}
                variant="outline"
                size="sm"
            >
                {isPreview ? 'Hidden' : 'Preview'}
            </Button>
            <Button
                onClick={onClick}
                disabled={disabled || isLoading || coursePublished}
                variant="outline"
                size="sm"
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading || coursePublished}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
