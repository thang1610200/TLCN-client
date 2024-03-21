'use client';

import { Content, Lesson } from '@/app/types';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';

interface CourseProgressButtonProps {
    initdata?: Content;
    course_slug: string;
    mutate: KeyedMutator<any>;
    next_lesson?: Content;
    isValidating: boolean;
}

const CourseProgressButton = ({
    initdata,
    course_slug,
    mutate,
    next_lesson,
    isValidating,
}: CourseProgressButtonProps) => {
    const isCompleted = !!initdata?.userProgress[0]?.isCompleted;
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession();
    const router = useRouter();

    const onClick = async () => {
        const toastId = toast.loading('Loading...');
        try {
            setIsLoading(true);
            await axios.patch(
                `${BACKEND_URL}/user-progress/complete-lesson`,
                {
                    email: session.data?.user.email,
                    course_slug,
                    content_token: initdata?.token,
                    ...(next_lesson?.token && {
                        next_content_token: next_lesson.token,
                    }),
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            mutate();
            if (next_lesson?.token) {
                //toast.success('New lesson has been opened', { id: toastId });
                router.push(
                    `/course/${course_slug}/lesson/${next_lesson.token}`
                );
            }
            toast.success('Progress updated', { id: toastId });
        } catch {
            toast.error('Something went wrong', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading || isCompleted}
            type="button"
            variant={isCompleted ? 'success' : 'outline'}
            className="w-full md:w-auto"
        >
            {isValidating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isCompleted ? 'Completed' : 'Mark as complete'}
            {isCompleted && <CheckCircle className="h-4 w-4 ml-2" />}
        </Button>
    );
};

export default CourseProgressButton;
