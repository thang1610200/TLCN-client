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
import { Language } from '@/app/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { KeyedMutator } from 'swr';
import { find } from 'lodash';
import LoadingGenerateModal from '@/components/modal/loading-generate-modal';

const GenerateSubtitleSchema = z.object({
    language: z.string(),
});

type GenerateSubtitleFormValues = z.infer<typeof GenerateSubtitleSchema>;

interface GenerateSubtitleModalProps {
    lesson_token: string;
    mutate: KeyedMutator<any>;
    chapter_token: string;
    course_slug: string;
}

export default function GenerateSubtitleModal({
    lesson_token,
    mutate,
    chapter_token,
    course_slug,
}: GenerateSubtitleModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const session = useSession();

    const options: { language: string; language_code: string }[] = Language;

    const form = useForm<GenerateSubtitleFormValues>({
        resolver: zodResolver(GenerateSubtitleSchema),
    });

    const { isValid, isSubmitting } = form.formState;

    function onSubmit(values: GenerateSubtitleFormValues) {
        const item = find(options,{language_code: values.language});

        setIsLoading(true);

        axios
            .post(
                `${BACKEND_URL}/lesson/generate-subtitle`,
                {
                    lesson_token,
                    course_slug,
                    chapter_token,
                    language: item?.language,
                    language_code: item?.language_code,
                    email: session.data?.user.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                toast.success('Generate success');
                mutate();
                handleCancel();
                router.refresh();
            })
            .catch((e) => {
                toast.error('Generate failed!');
            })
            .finally(() => {
                setIsLoading(true);
            });
    }

    const handleCancel = () => {
        form.reset();
        setIsOpen(false);
    };

    if(isLoading){
        return (
            <LoadingGenerateModal />
        )
    }

    return (
        <div>
            <Button className="absolute right-4 top-4 bg-blue-500 text-white" onClick={() => setIsOpen(true)}>
                Tạo phụ đề tự động
            </Button>
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
                                        Tạo phụ đề tự động
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
                                                                    Ngôn ngữ trong video
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
