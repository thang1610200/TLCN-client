'use client';

import { Course } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, PlusCircle, Store } from 'lucide-react';
import { useState } from 'react';
import { find } from 'lodash';
import { useRouter } from 'next/navigation';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface CourseSwitcherProps extends PopoverTriggerProps {
    items?: Course[];
    course_slug?: string;
}

const CourseSwitcher = ({
    className,
    items = [],
    course_slug,
}: CourseSwitcherProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const course_find = find(items, { slug: course_slug });

    const onSelectCourse = (course_slug?: string) => {
        if(!course_slug){
            router.push(`/instructor/user`)
        }
        else{
            router.push(`/instructor/user/${course_slug}`);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn('w-auto justify-between', className)}
                >
                    <Store className="mr-2 h-4 w-4" />
                    {course_find?.title || 'All course'}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup heading="Course">
                            <CommandItem
                                onSelect={() => onSelectCourse(undefined)}
                                className="text-sm"
                            >
                                <Store className="mr-2 h-4 w-4" />
                                All course
                                <Check
                                    className={cn(
                                        'ml-auto h-4 w-4',
                                        !course_slug
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            </CommandItem>
                            {items.map((course, index) => (
                                <CommandItem
                                    key={index}
                                    onSelect={() => onSelectCourse(course.slug)}
                                    className="text-sm"
                                >
                                    <Store className="mr-2 h-4 w-4" />
                                    {course.title}
                                    <Check
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            course_slug === course.slug
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    router.push('/instructor/course')
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create course
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CourseSwitcher;
