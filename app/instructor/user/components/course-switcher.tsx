"use client";

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface CourseSwitcherProps extends PopoverTriggerProps {
    items?: Course[];
    courseId?: string;
    onSelectCourse: (slug: string) => void;
}

const CourseSwitcher = ({
    className,
    items = [],
    courseId,
    onSelectCourse
}: CourseSwitcherProps) => {
    const [open, setOpen] = useState(false);
    const course = find(items, {id: courseId});

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
                    { course?.title }
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup heading="Course">
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
                                            courseId === course.id
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
                                    setOpen(false);

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
