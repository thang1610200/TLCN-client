"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Topic } from '@/app/types';
import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterBarProps {
    topic: Topic[];
}



export default function FilterBar({ topic }: FilterBarProps) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTopic = searchParams.get('topic');
    const currentTitle = searchParams.get('title');

    const onSelect = (framework: string) => {
        const url = qs.stringifyUrl(
            {
                url: "",
                query: {
                    title: currentTitle,
                    topic: framework === "all" ? null : framework
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        !url ? router.push("/") : router.push(url);
    };

    return (
        <div className="flex w-64 h-full pb-12 bg-green-400"> {/*Làm thành dropdown menu bỏ vào trong thanh search*/}
            <div className="space-y-4 ">
                <div className="px-3 ">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between rounded-3xl"
                            >
                                {currentTopic
                                    ? topic.find(
                                          (framework) =>
                                              framework.slug === currentTopic
                                      )?.title
                                    : 'All framework'}
                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0 rounded-lg">
                            <Command>
                                <CommandInput
                                    placeholder="Search framework..."
                                    className="h-9"
                                />
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => { onSelect("all") }}
                                        className="text-sm"
                                    >
                                        All framework
                                        <Check
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                !currentTopic 
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                    {topic.map((framework, index) => (
                                        <CommandItem
                                            key={index}
                                            value={framework.slug}
                                            onSelect={(currentValue) => {
                                                onSelect(currentValue);
                                                setOpen(true);
                                            }}
                                        >
                                            {framework.title}
                                            <Check
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    currentTopic === framework.slug
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                {/* <div className="px-3 ">
                    <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                        License
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                All
                            </label>
                        </div>

                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Premium
                            </label>
                        </div>
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Free
                            </label>
                        </div>
                    </div>
                </div> */}
                <div className="px-3 ">
                    <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                        Skill
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Beginner
                            </label>
                        </div>

                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Intermideate
                            </label>
                        </div>
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Advanced
                            </label>
                        </div>
                    </div>
                </div>
                <div className="px-3 ">
                    <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                        Time
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {'>30m'}
                            </label>
                        </div>

                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {'30m-60m'}
                            </label>
                        </div>
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {'<60m'}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="px-3 ">
                    <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                        Language
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                All
                            </label>
                        </div>

                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Vietnamese
                            </label>
                        </div>
                        <div className="flex items-center justify-start w-full px-4 space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                English
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
