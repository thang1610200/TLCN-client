'use client';

import * as z from 'zod';
import axios from 'axios';
import { PlusCircle, File, Loader2, X, ChevronsUpDown, Check, Languages } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Language, Lesson } from '@/app/types';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { find } from 'lodash';
import qs from "query-string";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SubtitleFormProps {
    initialData: Lesson;
    lesson_token: string;
    chapter_token: string;
    course_slug: string;
    mutate: KeyedMutator<any>;
}

const ACCEPTED_IMAGE_TYPES = [
    'vtt',
    'srt'
];

const formSchema = z.object({
    language: z.string(),
    attach: z
        .any()
        .refine(
            (files) => {
                const name = files?.[0]?.name.split(".");
                if(name) {
                    return ACCEPTED_IMAGE_TYPES.includes(name[name.length - 1]);
                }
            },
            'Only .vtt and .srt formats are supported.'
        )
})

export const SubtitleForm = ({
    initialData,
    lesson_token,
    mutate,
    chapter_token,
    course_slug
}: SubtitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const session = useSession();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attach: '',
        },
    });
    const options: { language: string; language_code: string }[] = Language; 

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const item = find(options,{language_code: values.language});

            await axios.post(
                `${BACKEND_URL}/lesson/add-subtitle`,
                {
                    lesson_token,
                    email: session.data?.user.email,
                    file: values.attach[0],
                    chapter_token,
                    course_slug,
                    language: item?.language,
                    language_code: item?.language_code
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
            mutate();
            router.refresh();
        } catch (err: any) {
            toast.error('Something went wrong');
        }
    };

    const onDelete = async (id: string) => {
        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/lesson/delete-subtitle`,
            query: {
                lesson_token,
                email: session.data?.user.email,
                chapter_token,
                course_slug,
                subtitleId: id
            }
        })

        try {
            setDeletingId(id);
            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    }
                }

            );
            toast.success('Subtitle deleted');
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setDeletingId(null);
        }
    };

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Subtitle
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && <>Hủy</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Thêm 1 tệp
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData?.subtitles?.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            Chưa có phụ đề nào
                        </p>
                    )}
                    {initialData?.subtitles?.length > 0 && (
                        <div className="space-y-2">
                            {initialData.subtitles.map((subtitle) => (
                                <div
                                    key={subtitle.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <a href={subtitle.file} className="text-xs line-clamp-1">
                                        {subtitle.language}
                                    </a>
                                    {deletingId === subtitle.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}

                                    <div className='ml-auto flex gap-3'>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Languages className="h-4 w-4 hover:opacity-75 transition"  />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Dịch
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {deletingId !== subtitle.id && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <button
                                                    onClick={() =>
                                                        onDelete(subtitle.id)
                                                    }
                                                    className="hover:opacity-75 transition"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Xóa
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-4 space-y-4"
                        >
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ngôn ngữ</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={isSubmitting}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        'w-full justify-between',
                                                        !field.value &&
                                                            'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value
                                                        ? options.find(
                                                              (data) =>
                                                                  data.language_code ===
                                                                  field.value
                                                          )?.language
                                                        : 'Select option...'}
                                                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search option..." />
                                                <CommandEmpty>
                                                    Không tìm thấy tùy chọn
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {options.map((data) => (
                                                        <CommandItem
                                                            value={
                                                                data.language
                                                            }
                                                            key={data.language_code}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    'language',
                                                                    data.language_code,
                                                                    {
                                                                        shouldValidate:
                                                                            true,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.language_code ===
                                                                        field.value
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0'
                                                                )}
                                                            />
                                                            {data.language}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                            <FormField
                                control={form.control}
                                name="attach"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>File</FormLabel>
                                        <FormControl>
                                            <Input
                                                accept='.vtt,.srt'
                                                disabled={isSubmitting}
                                                type="file"
                                                {...form.register('attach')}
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
                                {/* <Button disabled={!isValid || isSubmitting} type="button">Cancel</Button> */}
                            </div>
                        </form>
                    </Form>
                    <div className="text-xs text-muted-foreground mt-4">
                        Thêm phụ đề cho video bài giảng.
                    </div>
                </div>
            )}
        </div>
    );
};
