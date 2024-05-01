'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';
import { cn } from '@/lib/utils';
import { Code, LanguageType, MimeFileType} from '@/app/types';
import { Input } from '@/components/ui/input';
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
import { TabFile } from './tab-file';

interface FileFormProps {
    initialData?: Code;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
    languageLab: LanguageType[];
}

const formSchema = z.object({
    name: z.string().min(1),
    language: z.enum(Object.values(LanguageType) as [string, ...string[]]),
});

export const FileForm = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
    languageLab,
}: FileFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const session = useSession();

    const options: { label: string; value: string }[] = languageLab.map(
        (item) => {
            return {
                label: item.toUpperCase(),
                value: item,
            };
        }
    );

    const mimeArrays: { label: string; value: MimeFileType }[] = Object.entries(MimeFileType).map((items) => {
        return {
            label: items[0],
            value: items[1]
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `${BACKEND_URL}/code/add-file-code`,
                {
                    code_token,
                    exercise_token,
                    fileName: values.name,
                    email: session.data?.user.email,
                    chapter_token,
                    course_slug,
                    languageCode: values.language,
                    mimeFile: mimeArrays.find((item) => {
                        if(item.label === values.language) return item.value;
                    })?.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('File updated');
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                File
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData?.file ? (
                    <p
                        className='text-sm mt-2 text-slate-500 italic'
                    >
                        No lab
                    </p>
                ) : (
                    <TabFile
                        code_token={code_token}
                        chapter_token={chapter_token}
                        course_slug={course_slug}
                        exercise_token={exercise_token} 
                        mutate={mutate}
                        initialData={initialData}
                        fileType='SOLUTION'
                    />
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên file</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'main'"
                                            {...form.register('name')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search option..." />
                                                <CommandEmpty>
                                                    No option found.
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
                                                                    'language',
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
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
