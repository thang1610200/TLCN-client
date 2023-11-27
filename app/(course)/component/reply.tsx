'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SendHorizontal, SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import useAllReviewCourse from '@/app/hook/useAllReviewCourse';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import toast from 'react-hot-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { KeyedMutator } from 'swr';

interface ReviewCourseProp {
    handleOpenReply: () => void,
    reviewId: string,
    mutate: KeyedMutator<any>
}

const formSchema = z.object({
    content: z.string().min(1, {
        message: 'Content is required',
    }),
});

const ReplyCourse: React.FC<ReviewCourseProp> = ({ handleOpenReply, reviewId, mutate }) => {
    const session = useSession();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<any>(null);
    const router = useRouter();
    const [contents, setContent] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        },
    });

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setContent((contents) => contents + emojiObject.emoji);
    };

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async () => {
        try {
            await axios.post(
                `${BACKEND_URL}/review/add-reply`,
                {
                    reviewId,
                    reply: contents,
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setContent('');
            handleOpenReply();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (event.target.id !== 'emoji-open') {
                if (
                    emojiPickerRef.current &&
                    !emojiPickerRef.current.contains(event.target)
                ) {
                    setShowEmojiPicker(false);
                }
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [emojiPickerRef]);

    const handleEmojiModal = () => {
        setShowEmojiPicker((data) => !data);
    };

    return (
        <div>
            <div className="flex mt-3 pb-1 w-full pl-14">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="w-full relative">
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Write a comment......"
                                            {...form.register('content')}
                                            onChange={(e) =>
                                                {
                                                    form.setValue('content',e.target.value);
                                                    setContent(e.target.value)
                                                }
                                            }
                                        />
                                    </FormControl>
                                    <div className="absolute right-3 w-6 h-6 hover:bg-dark/5 rounded-full flex items-center justify-center bottom-1.5">
                                        <div className="cursor-pointer">
                                            <SmilePlus
                                                id="emoji-open"
                                                onClick={handleEmojiModal}
                                            />
                                            {showEmojiPicker && (
                                                <div
                                                    className="absolute bottom-24 left-16 z-40"
                                                    ref={emojiPickerRef}
                                                >
                                                    <EmojiPicker
                                                        onEmojiClick={
                                                            handleEmojiClick
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="send"
                            disabled={isSubmitting || !isValid}
                            className="mt-3 text-white font-bold"
                        >
                            <span className="z-10 inline-flex w-full items-center justify-center">
                                Submit
                            </span>
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={isSubmitting}
                            onClick={handleOpenReply}
                            className="mt-3 ml-3 font-bold"
                        >
                            <span className="z-10 inline-flex w-full items-center justify-center">
                                Dismiss
                            </span>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ReplyCourse;
