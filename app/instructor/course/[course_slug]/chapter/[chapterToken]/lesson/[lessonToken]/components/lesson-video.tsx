'use client';

import * as z from 'zod';
import axios from 'axios';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/app/types';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactPlayer from 'react-player';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constant';

interface LessonVideoFormProps {
    initialData: Lesson;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    mutate: KeyedMutator<any>;
}

const MAX_FILE_SIZE = 25000000;
const ACCEPTED_IMAGE_TYPES = ['video/mp4', 'video/webm'];

const formSchema = z.object({
    videoUrl: z
        .any()
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Max video size is 25MB.`
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            'Only .mp4, .webm formats are supported.'
        ),
});

export const LessonVideoForm = ({
    initialData,
    course_slug,
    chapter_token,
    lesson_token,
    mutate,
}: LessonVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        form.setValue('videoUrl', '');
        setIsEditing((current) => !current);
    };

    const session = useSession();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/lesson/update-video`,
                {
                    file: values.videoUrl[0],
                    chapter_token,
                    course_slug,
                    email: session.data?.user.email,
                    lesson_token,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('Lesson updated');
            toggleEdit();
            router.refresh();
            mutate();
        } catch {
            toast.error('Something went wrong');
        }
    };

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData?.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData?.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData?.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        {
                            <ReactPlayer
                                width="100%"
                                controls
                                light={initialData.thumbnail ? initialData.thumbnail : ""}
                                url={
                                    initialData.isCompleteVideo
                                        ? initialData?.videoUrl
                                        : ''
                                }
                            />
                        }
                    </div>
                ))}
            {isEditing && (
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                accept="video/*"
                                                type="file"
                                                {...form.register('videoUrl')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-x-2">
                                <Button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this lesson&apos;s video
                    </div>
                </div>
            )}
            {initialData?.videoUrl &&
                !isEditing &&
                !initialData?.isCompleteVideo && (
                    <div className="text-xs text-muted-foreground mt-2">
                        Videos can take a few minutes to process. Refresh the
                        page if video does not appear.
                    </div>
                )}
        </div>
    );
};
