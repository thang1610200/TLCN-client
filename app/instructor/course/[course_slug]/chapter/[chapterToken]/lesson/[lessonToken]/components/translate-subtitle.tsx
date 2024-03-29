'use client';

import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
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
import Loader from '@/components/loader';
import * as z from 'zod';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Language, Subtitle } from '@/app/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Languages } from 'lucide-react';
import { KeyedMutator } from 'swr';
import { find } from 'lodash';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const TranslateSubtitleSchema = z.object({
    language: z.string(),
});

type TranslateSubtitleFormValues = z.infer<typeof TranslateSubtitleSchema>;

interface TranslateSubtitleModalProps {
    subtitle: Subtitle;
    lesson_token: string;
    mutate: KeyedMutator<any>;
    chapter_token: string;
    course_slug: string;
}

export default function TranslateSubtitleModal({
    subtitle,
    lesson_token,
    mutate,
    chapter_token,
    course_slug,
}: TranslateSubtitleModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const session = useSession();

    const options: { language: string; language_code: string }[] = Language.filter((item) => {
        return item.language_code !== subtitle.language_code;
    });

    const form = useForm<TranslateSubtitleFormValues>({
        resolver: zodResolver(TranslateSubtitleSchema),
    });

    const { isValid, isSubmitting } = form.formState;

    function onSubmit(values: TranslateSubtitleFormValues) {
        const item = find(options, { language_code: values.language });
        axios
            .post(
                `${BACKEND_URL}/lesson/translate-subtitle`,
                {
                    lesson_token,
                    course_slug,
                    chapter_token,
                    language: item?.language,
                    language_code: item?.language_code,
                    email: session.data?.user.email,
                    subtitleId: subtitle.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                toast('Quá trình này có thể diễn ra trong vài phút',{
                    position: 'top-left',
                    duration: 2000
                })
                //mutate();
                handleCancel();
                router.refresh();
            })
            .catch((e) => {
                toast.error('Generate failed!');
            });
    }

    const handleCancel = () => {
        form.reset();
        setIsOpen(false);
    };

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger onClick={() => setIsOpen(true)}>
                        <Languages className="h-4 w-4 hover:opacity-75 transition" />
                    </TooltipTrigger>
                    <TooltipContent>Dịch</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10 w-80"
                    onClose={() => {
                        setIsOpen(false);
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full gap-5 p-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-1/3 p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h2"
                                        className="flex justify-center p-4 text-3xl font-medium leading-6 text-gray-900"
                                    >
                                        Dịch phụ đề
                                    </Dialog.Title>
                                    <div className="p-5">
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    onSubmit
                                                )}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="language"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Ngôn ngữ
                                                                    muốn dịch
                                                                </FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger
                                                                        asChild
                                                                    >
                                                                        <FormControl>
                                                                            <Button
                                                                                disabled={
                                                                                    isSubmitting
                                                                                }
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
                                                                                          (
                                                                                              data
                                                                                          ) =>
                                                                                              data.language_code ===
                                                                                              field.value
                                                                                      )
                                                                                          ?.language
                                                                                    : 'Select option...'}
                                                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-full p-0">
                                                                        <Command>
                                                                            <CommandInput placeholder="Search option..." />
                                                                            <CommandEmpty>
                                                                                Không
                                                                                tìm
                                                                                thấy
                                                                                tùy
                                                                                chọn
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {options.map(
                                                                                    (
                                                                                        data
                                                                                    ) => (
                                                                                        <CommandItem
                                                                                            value={
                                                                                                data.language
                                                                                            }
                                                                                            key={
                                                                                                data.language_code
                                                                                            }
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
                                                                                            {
                                                                                                data.language
                                                                                            }
                                                                                        </CommandItem>
                                                                                    )
                                                                                )}
                                                                            </CommandGroup>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="grid w-full grid-cols-2 px-10 gap-x-10 ">
                                                    {/* <Button type="button" onClick={() => { setIsDisable(false) }}>Update Profile</Button> */}
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            isSubmitting ||
                                                            !isValid
                                                        }
                                                    >
                                                        Generate
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
