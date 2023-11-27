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
import ReviewItem from './review-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Course, Lesson } from '@/app/types';

interface ReviewCourseProp {
    course_slug?: string;
    course?: Course
}

const formSchema = z.object({
    content: z.string().min(1, {
        message: 'Content is required',
    }),
});

const ReviewCourse: React.FC<ReviewCourseProp> = ({ course_slug, course }) => {
    const session = useSession();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<any>(null);
    const router = useRouter();
    const { data : review = [], isLoading, error, mutate } = useAllReviewCourse(
        course_slug,
        session.data?.backendTokens.accessToken
    );
    const [content, setContent] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        },
    });

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setContent((contents) => contents + emojiObject.emoji)
    }

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async () => {
        try {
            await axios.post(`${BACKEND_URL}/review/add-review`, {
                course_slug: course_slug,
                content: content,
                email: session.data?.user.email
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            setContent("");
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

    if (error) {
        router.back();
    }

    return (
        <div>
            <div className="flex mt-3 pb-1 w-full">
                <div className="relative w-12 h-12 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-inherit">
                    <Avatar className="w-full h-fit">
                        <AvatarImage
                            src={session.data?.user.image}
                            alt="User Image"
                        />
                    </Avatar>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex ml-4 w-full'
                    >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className='w-full relative'>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isSubmitting}
                                                    placeholder="Write a comment......"
                                                    {...form.register("content")} 
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                />
                                            </FormControl>
                                            <div className="absolute right-3 w-6 h-6 hover:bg-dark/5 rounded-full flex items-center justify-center bottom-1.5">
                                                <div className="cursor-pointer">
                                                    <SmilePlus
                                                        id="emoji-open"
                                                        onClick={
                                                            handleEmojiModal
                                                        }
                                                    />
                                                    {showEmojiPicker && (
                                                        <div
                                                            className="absolute bottom-24 left-16 z-40"
                                                            ref={emojiPickerRef}
                                                        >
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
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
                            className="relative flex justify-center items-center transition-transform transform focus:outline-none ring-transparent opacity-50 w-12 h-10 ml-3 xs:w-14 xs:ml-2 hover:opacity-100 active:opacity-100"
                        >
                            <span className="z-10 inline-flex w-full items-center justify-center">
                                <SendHorizontal className="text-white" />
                            </span>
                        </Button>
                    </form>
                </Form>
            </div>
            <div className='w-full my-3'>
                {
                    isLoading ? (
                        [...Array(3)].map((x,i) => (
                            <div className="flex mt-3 pb-1 w-full" key={i}>
                                <Skeleton className="relative w-12 h-12 rounded-full" />
                                <Skeleton className='ml-4 w-full' />
                            </div>
                        ))
                    ): 
                    (review.map((item) => (
                        <ReviewItem
                            course={course}
                            mutate={mutate}
                            key={item.id}
                            review={item} 
                        />
                    )))
                }
            </div>                                           
        </div>
    );
};

export default ReviewCourse;
