'use client';

import { Content, Lesson } from '@/app/types';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, Fragment } from 'react';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';
import { Dialog, Transition } from '@headlessui/react';
import qs from 'query-string';

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
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setSummary] = useState<string>("");

    function closeModal() {
        setIsOpen(false);
    }

    const openModal = async () => {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/lesson/summary-video`,
            query: {
                content_token: initdata?.token,
                course_slug
            }
        })

        try {
            const response = await axios.get(url,{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            setSummary(response.data);
            setIsOpen(true);
        }
        catch {
            toast.error('Something went wrong!');
        }
    }

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
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Video Summary
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {summary}
                                        </p>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Button
                onClick={openModal}
                className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
            >
                <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
                <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                    <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
                    <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
                </span>
                <span className="relative text-white">SUMMARY</span>
            </Button>
            <Button
                onClick={onClick}
                disabled={isLoading || isCompleted}
                type="button"
                variant={isCompleted ? 'success' : 'outline'}
                className="w-full md:w-auto"
            >
                {isValidating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isCompleted ? 'Completed' : 'Mark as complete'}
                {isCompleted && <CheckCircle className="h-4 w-4 ml-2" />}
            </Button>
        </>
    );
};

export default CourseProgressButton;
