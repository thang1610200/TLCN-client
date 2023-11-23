"use client";

import { Lesson } from '@/app/types';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';

interface CourseProgressButtonProps {
    initdata?: Lesson;
    course_slug: string;
    mutate: KeyedMutator<any>
}

const CourseProgressButton = ({
    initdata,
    course_slug,
    mutate
}: CourseProgressButtonProps) => {
    const isCompleted =
        initdata?.userProgress.length === 0
            ? false
            : initdata?.userProgress[0].isCompleted;
    const [isLoading, setIsLoading] = useState(false);
    //const Icon = isCompleted ? XCircle : CheckCircle;
    const session = useSession();
    const router = useRouter();

    const onClick = async () => {
        if(!isCompleted){
            try {
                setIsLoading(true);
    
                axios.put(
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
                router.refresh();
                mutate();
            } catch {
                toast.error('Something went wrong');
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
            {isCompleted && (
                <CheckCircle className="h-4 w-4 ml-2" />
            )}
        </Button>
    );
};

export default CourseProgressButton;
