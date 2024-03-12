'use client';

import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { BiPlusCircle } from 'react-icons/bi';
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
import { LevelQuizz, TypeQuizz } from '@/app/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Zap } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { KeyedMutator } from 'swr';
import LoadingGenerateModal from '@/components/modal/loading-generate-modal';

const QuizzAiSchema = z.object({
    topic: z
        .string()
        .min(2, {
            message: 'Topic must be at least 2 characters.',
        })
        .max(100, {
            message: 'Topic must not be longer than 100 characters.',
        }),
    number: z
        .number({
            required_error: 'Number is required',
        })
        .int()
        .positive()
        .lte(5, { message: 'This is too big' }),
    type: z.enum([TypeQuizz.TF, TypeQuizz.MC]),
    level: z.enum([LevelQuizz.Easy, LevelQuizz.Medium, LevelQuizz.Hard]),
});

type QuizzAiFormValues = z.infer<typeof QuizzAiSchema>;

interface QuizzAiModalProps {
    exercise_token?: string;
    mutate: KeyedMutator<any>;
    chapter_token: string;
    course_slug: string;
}

export default function QuizzAiModal({
    exercise_token,
    mutate,
    chapter_token,
    course_slug
}: QuizzAiModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const session = useSession();

    const defaultValues: Partial<QuizzAiFormValues> = {
        topic: '',
        number: 1,
        type: TypeQuizz.MC,
        level: LevelQuizz.Easy,
    };

    const types: { label: string; value: TypeQuizz }[] = [
        {
            label: TypeQuizz.MC,
            value: TypeQuizz.MC,
        },
        {
            label: TypeQuizz.TF,
            value: TypeQuizz.TF,
        },
    ];

    const levels: { label: string; value: LevelQuizz }[] = [
        {
            label: LevelQuizz.Easy,
            value: LevelQuizz.Easy,
        },
        {
            label: LevelQuizz.Medium,
            value: LevelQuizz.Medium,
        },
        {
            label: LevelQuizz.Hard,
            value: LevelQuizz.Hard,
        }
    ];

    const form = useForm<QuizzAiFormValues>({
        resolver: zodResolver(QuizzAiSchema),
        defaultValues,
    });

    function onSubmit(data: QuizzAiFormValues) {
        setIsLoading(true);
        axios
            .post(
                `${BACKEND_URL}/chatgpt/quizz-list`,
                {
                    topic: data.topic,
                    type: data.type,
                    level: data.level,
                    exercise_token,
                    email: session.data?.user.email,
                    amount: data.number,
                    course_slug,
                    chapter_token
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
                setIsLoading(false)
            });
    }

    const handleCancel = () => {
        form.reset();
        setIsOpen(false);
    };

    const { isValid } = form.formState;

    if(isLoading){
        return (
            <LoadingGenerateModal />
        )
    }

    return (
        <div>
            <div onClick={() => setIsOpen(true)}>
                    <button className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-indigo-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none">
                        <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                        <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                        <span className="relative z-20 flex items-center text-sm">
                            <Zap className="relative w-5 h-5 mr-2 text-white" />
                            Autocompleted with AI
                        </span>
                    </button>
            </div>
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
                                        Setup Quiz
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
                                                        name="topic"
                                                        render={({ field }) => (
                                                            <FormItem className='mb-5'>
                                                                <FormLabel className='font-medium'>
                                                                    Topic
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        placeholder="e.g. 'Javascript'"
                                                                        {...form.register(
                                                                            'topic'
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription></FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="number"
                                                        render={({ field }) => (
                                                            <FormItem className='mb-5'>
                                                                <FormLabel className='font-medium'>
                                                                    Number of question
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type='number'
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        placeholder="e.g. 'Number'"
                                                                        {...form.register(
                                                                            'number',{ valueAsNumber: true}
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription></FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem className='mb-5'>
                                                                <FormLabel>
                                                                    Type
                                                                </FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger
                                                                        asChild
                                                                    >
                                                                        <FormControl>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                className={cn(
                                                                                    'w-full justify-between',
                                                                                    !field.value &&
                                                                                        'text-muted-foreground'
                                                                                )}
                                                                            >
                                                                                {field.value
                                                                                    ? types.find(
                                                                                          (
                                                                                              language
                                                                                          ) =>
                                                                                              language.value ===
                                                                                              field.value
                                                                                      )
                                                                                          ?.label
                                                                                    : 'Select option...'}
                                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-full p-0">
                                                                        <Command>
                                                                            <CommandInput placeholder="Search option..." />
                                                                            <CommandEmpty>
                                                                                No
                                                                                option
                                                                                found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {types.map(
                                                                                    (
                                                                                        language
                                                                                    ) => (
                                                                                        <CommandItem
                                                                                            disabled={isLoading}
                                                                                            value={
                                                                                                language.label
                                                                                            }
                                                                                            key={
                                                                                                language.value
                                                                                            }
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'type',
                                                                                                    language.value,
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
                                                                                                    language.value ===
                                                                                                        field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {
                                                                                                language.label
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
                                                    <FormField
                                                        control={form.control}
                                                        name="level"
                                                        render={({ field }) => (
                                                            <FormItem className='mb-5'>
                                                                <FormLabel>
                                                                    Select Difficulty 
                                                                </FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger
                                                                        asChild
                                                                    >
                                                                        <FormControl>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                className={cn(
                                                                                    'w-full justify-between',
                                                                                    !field.value &&
                                                                                        'text-muted-foreground'
                                                                                )}
                                                                            >
                                                                                {field.value
                                                                                    ? levels.find(
                                                                                          (
                                                                                              language
                                                                                          ) =>
                                                                                              language.value ===
                                                                                              field.value
                                                                                      )
                                                                                          ?.label
                                                                                    : 'Select option...'}
                                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-full p-0">
                                                                        <Command>
                                                                            <CommandInput placeholder="Search option..." />
                                                                            <CommandEmpty>
                                                                                No
                                                                                option
                                                                                found.
                                                                            </CommandEmpty>
                                                                            <CommandGroup>
                                                                                {levels.map(
                                                                                    (
                                                                                        language
                                                                                    ) => (
                                                                                        <CommandItem
                                                                                            disabled={isLoading}
                                                                                            value={
                                                                                                language.label
                                                                                            }
                                                                                            key={
                                                                                                language.value
                                                                                            }
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    'level',
                                                                                                    language.value,
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
                                                                                                    language.value ===
                                                                                                        field.value
                                                                                                        ? 'opacity-100'
                                                                                                        : 'opacity-0'
                                                                                                )}
                                                                                            />
                                                                                            {
                                                                                                language.label
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
                                                        disabled={isLoading || !isValid}
                                                        className="flex disabled:bg-slate-200 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? (
                                                            <Loader />
                                                        ) : (
                                                            'Generate'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="flex disabled:bg-slate-200 disabled:cursor-not-allowed"
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
