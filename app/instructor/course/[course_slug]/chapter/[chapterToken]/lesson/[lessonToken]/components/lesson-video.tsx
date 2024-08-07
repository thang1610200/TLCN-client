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
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lesson, QueueType } from '@/app/types';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactPlayer from 'react-player';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constant';
import { TrackProps } from 'react-player/file';
import GenerateSubtitleModal from './generate-subtitle';

interface LessonVideoFormProps {
    initialData: Lesson;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    mutate: KeyedMutator<any>;
}

const MAX_FILE_SIZE = 200000000;
const ACCEPTED_IMAGE_TYPES = ['video/mp4', 'video/webm'];

const formSchema = z.object({
    videoUrl: z
        .any()
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Max video size is 200MB.`
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
            const videoElmnt = document.createElement('video');

            videoElmnt.src = URL.createObjectURL(values.videoUrl[0]);
            videoElmnt.load();

            videoElmnt.addEventListener('error', () => {
                toast.error('Something went wrong');
            });
            videoElmnt.addEventListener('loadedmetadata', async () => {
                const duration = Math.round(videoElmnt.duration).toString();

                await axios.patch(
                    `${BACKEND_URL}/lesson/update-video`,
                    {
                        file: values.videoUrl[0],
                        chapter_token,
                        course_slug,
                        email: session.data?.user.email,
                        lesson_token,
                        duration,
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

                URL.revokeObjectURL(videoElmnt.src);
                videoElmnt.remove();
            });
        } catch {
            toast.error('Something went wrong');
        }
    };

    const tracks: TrackProps[] = useMemo(() => {
        if (!initialData?.subtitles) return [];
        return initialData?.subtitles.map((item) => {
            return {
                kind: 'subtitles',
                src: item.file,
                srcLang: item.language_code,
                label: item.language,
            };
        });
    }, [initialData]);

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Video bài học
                {initialData?.asyncVideo?.type !== QueueType.Progressing && (
                    <Button onClick={toggleEdit} variant="ghost">
                        {isEditing && <>Cancel</>}
                        {!isEditing && !initialData?.videoUrl && (
                            <>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Thêm video
                            </>
                        )}
                        {!isEditing && initialData?.videoUrl && (
                            <>
                                <Pencil className="w-4 h-4 mr-2" />
                                Chỉnh sửa video
                            </>
                        )}
                    </Button>
                )}
            </div>
            {!isEditing &&
                (!initialData?.videoUrl ? (
                    <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
                        <Video className="w-10 h-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative mt-2 aspect-video">
                        {
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                controls
                                light={
                                    initialData.thumbnail
                                        ? initialData.thumbnail
                                        : ''
                                }
                                url={
                                    initialData?.videoUrl
                                        ? initialData?.videoUrl
                                        : ''
                                }
                                config={{
                                    file: {
                                        attributes: {
                                            crossOrigin: 'true',
                                        },
                                        tracks,
                                    },
                                }}
                            />
                        }
                        {initialData?.videoUrl && (
                            <GenerateSubtitleModal
                                course_slug={course_slug}
                                chapter_token={chapter_token}
                                lesson_token={lesson_token}
                                mutate={mutate}
                            />
                        )}
                    </div>
                ))}
            {isEditing && (
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-4 space-y-4"
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
                                    Lưu lại
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-xs text-muted-foreground">
                        Đăng tải video bài học
                    </div>
                </div>
            )}
            {!isEditing &&
                initialData?.asyncVideo?.type === QueueType.Progressing && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        Video cần một vài phút để hoàn thành. Refresh trang để
                        hiển thị video
                    </div>
                )}
            {initialData?.asyncVideo?.type === QueueType.Warning && (
                <div className="mt-2 text-xs text-muted-foreground">
                    Video có chứa các nội dung như Hate, Self Harm, Sexual,
                    Violence
                </div>
            )}
        </div>
    );
};
