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
import { Input } from '@/components/ui/input';
import Loader from '@/components/loader';
import * as z from 'zod';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TypeExercise } from '@/app/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { KeyedMutator } from 'swr';

const ExerciseFormSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: 'Title must be at least 2 characters.',
        })
        .max(100, {
            message: 'Title must not be longer than 100 characters.',
        }),
    type: z.enum(Object.values(TypeExercise) as [string, ...string[]])
});

type ExerciseFormValues = z.infer<typeof ExerciseFormSchema>;

interface CreateExerciseProps {
    chapter_token: string;
    course_slug: string;
    mutate: KeyedMutator<any>;
}

export default function CreateExerciseModal({
    chapter_token,
    course_slug,
    mutate
}: CreateExerciseProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const session = useSession();

    const defaultValues: Partial<ExerciseFormValues> = {
        title: '',
        type: TypeExercise.Quizz
    };

    const options: { label: string; value: TypeExercise }[] = Object.entries(TypeExercise).map((item) => {
            return {
                label: item[0],
                value: item[1]
            };
        });

    const form = useForm<ExerciseFormValues>({
        resolver: zodResolver(ExerciseFormSchema),
        defaultValues,
    });

    function onSubmit(data: ExerciseFormValues) {
        setIsLoading(true);
        axios
            .post(
                `${BACKEND_URL}/exercise/create-exercise`,
                {
                    title: data.title,
                    typeExercise: data.type,
                    email: session.data?.user.email,
                    typeContent: "EXERCISE",
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
                mutate();
                toast.success('Create success');
                handleCancel();
                router.refresh();
            })
            .catch((e) => {
                toast.error('Something went wrong');
            })
            .finally(() => setIsLoading(false));
    }

    const handleCancel = () => {
        form.reset();
        setIsOpen(false);
    };

    return (
        <div className="ml-auto">
            <div className="ml-auto" onClick={() => setIsOpen(true)}>
                <Button>
                    <BiPlusCircle className="w-4 h-4 mr-2" />
                    Tạo bài tập mới
                </Button>
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
                                <Dialog.Panel className="w-1/2 p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex justify-center p-4 text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Tạo bài tập mới
                                    </Dialog.Title>
                                    <div className="w-full p-10 border-2 rounded-lg ">
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    onSubmit
                                                )}
                                                className="space-y-8"
                                            >
                                                <div className="grid md:grid-cols-4 md:gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-3">
                                                                <FormLabel>
                                                                    Exercise title
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        placeholder="e.g. 'Advanced Web Development'"
                                                                        {...form.register(
                                                                            'title'
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Type</FormLabel>
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
                                                                                    ? options.find(
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
                                                                                {options.map(
                                                                                    (
                                                                                        language
                                                                                    ) => (
                                                                                        <CommandItem
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
                                                </div>
                                                <div className="grid w-full grid-cols-2 px-10 gap-x-10 ">
                                                    {/* <Button type="button" onClick={() => { setIsDisable(false) }}>Update Profile</Button> */}
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="flex disabled:bg-slate-200 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? (
                                                            <Loader />
                                                        ) : (
                                                            'Tiếp tục'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="flex disabled:bg-slate-200 disabled:cursor-not-allowed"
                                                    >
                                                        Hủy
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
