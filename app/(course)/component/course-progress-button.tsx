'use client';

import { useConfettiStore } from '@/app/hook/useConfettiStore';
import { Lesson } from '@/app/types';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';

interface CourseProgressButtonProps {
    initdata?: Lesson;
    course_slug: string;
    mutate: KeyedMutator<any>;
    next_lesson?: Lesson;
}

const CourseProgressButton = ({
    initdata,
    course_slug,
    mutate,
    next_lesson,
}: CourseProgressButtonProps) => {
    const isCompleted =
        initdata?.userProgress.length === 0
            ? false
            : initdata?.userProgress[0].isCompleted;
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();
    const session = useSession();
    const router = useRouter();

    const onClick = async () => {
        if ((!isCompleted && initdata?.exerciseId) || (!isCompleted && !initdata?.exerciseId && !next_lesson)) {
            try {
                setIsLoading(true);

                await axios.put(
                    `${BACKEND_URL}/user-progress/add-user-progress`,
                    {
                        email: session.data?.user.email,
                        lesson_token: initdata?.token,
                        isCompleted: true,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                toast.success('Progress updated');
                if (!next_lesson) {
                    toast.success('You have completed the course');
                    confetti.onOpen();
                }
                mutate();
            } catch {
                toast.error('Something went wrong');
            } finally {
                setIsLoading(false);
            }
        } else if (!isCompleted && !initdata?.exerciseId) {
            const toastId = toast.loading('Loading...');
            try {
                setIsLoading(true);

                await axios.post(
                    `${BACKEND_URL}/user-progress/user-progress-next`,
                    {
                        email: session.data?.user.email,
                        lesson_token: initdata?.token,
                        isCompleted: true,
                        lesson_next: next_lesson?.token
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                toast.success('Progress updated');
                mutate();
                toast.success('New lesson has been opened', { id: toastId });
                router.push(`/course/${course_slug}/lesson/${next_lesson?.token}`);
            } catch {
                toast.error('Something went wrong', { id: toastId });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? 'success' : 'outline'}
            className="w-full md:w-auto"
        >
            {isCompleted ? 'Completed' : 'Mark as complete'}
            {isCompleted && <CheckCircle className="h-4 w-4 ml-2" />}
        </Button>
    );
};

export default CourseProgressButton;
