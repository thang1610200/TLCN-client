'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Check, ChevronsUpDown, Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Course } from '@/app/types';
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
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';

interface CategoryFormProps {
    initialData?: Course;
    course_slug?: string;
    options: { label: string; value: string }[];
    mutate: KeyedMutator<any>;
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({
    initialData,
    course_slug,
    options,
    mutate,
}: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.topic_id || '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `${BACKEND_URL}/course/update-course`,
                {
                    slug: course_slug,
                    value: {
                        topic_id: values.categoryId,
                    },
                    email: session.data?.user.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Course updated');
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    const selectedOption = options.find(
        (option) => option.value === initialData?.topic_id
    );

    return (
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Danh mục khóa học
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Hủy bỏ</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Chỉnh sửa danh mục
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        'text-sm mt-2',
                        !initialData?.topic_id && 'text-slate-500 italic'
                    )}
                >
                    {selectedOption?.label || 'No topic'}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <Popover>
                                        <PopoverTrigger asChild>
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
                                                              (language) =>
                                                                  language.value ===
                                                                  field.value
                                                          )?.label
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
                                                    {options.map((language) => (
                                                        <CommandItem
                                                            value={
                                                                language.label
                                                            }
                                                            key={language.value}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    'categoryId',
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
                                                            {language.label}
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
            )}
        </div>
    );
};
