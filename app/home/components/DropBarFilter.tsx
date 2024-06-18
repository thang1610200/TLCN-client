'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import qs from 'query-string';
import { Topic } from '@/app/types';

const durations: { id: string; label: string }[] = [
    {
        id: 'extraShort',
        label: '0-1 giờ',
    },
    {
        id: 'short',
        label: '1-3 giờ',
    },
    {
        id: 'medium',
        label: '3-6 giờ',
    },
    {
        id: 'long',
        label: '6-17 giờ',
    },
    {
        id: 'extraLong',
        label: 'Hơn 17 giờ',
    },
];

const levels: { id: string; label: string }[] = [
    {
        id: 'beginner',
        label: 'Sơ cấp',
    },
    {
        id: 'intermediate',
        label: 'Trung cấp',
    },
    {
        id: 'expert',
        label: 'Chuyên gia',
    },
];

const FormSchema = z.object({
    duration: z.array(z.string()).optional().default([]),
    topic: z.array(z.string()).optional().default([]),
    level: z.array(z.string()).optional().default([]),
});

interface DropBarFilterProps {
    topic: Topic[];
}

type TopicProps = {
    id?: string;
    label: string;
};

const DropBarFilter: React.FC<DropBarFilterProps> = ({ topic }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const currentTitle = searchParams.get('title');
    const currentTopic = searchParams.getAll('topic');
    const currentDuration = searchParams.getAll('duration');
    const currentLevel = searchParams.getAll('level');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            topic: currentTopic ? currentTopic : [],
            duration: currentDuration ? currentDuration : [],
            level: currentLevel ? currentLevel : [],
        },
    });

    const topics: TopicProps[] = topic.map((item) => {
        return {
            id: item.slug,
            label: item.title,
        };
    });

    useEffect(() => {
        const subscription = form.watch((data) => {
            const url = qs.stringifyUrl(
                {
                    url: pathname,
                    query: {
                        title: currentTitle,
                        topic: data.topic ? data.topic : null,
                        duration: data.duration ? data.duration : null,
                        level: data.level ? data.level : null,
                    },
                },
                { skipNull: true, skipEmptyString: true }
            );
            return router.push(url);
        });
        return () => subscription.unsubscribe();
    }, [form, router, currentTitle]);

    return (
        <Form {...form}>
            <form className="space-y-8">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger type="button">
                                Chủ đề
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[430px] gap-3 p-4 ">
                                    <FormField
                                        control={form.control}
                                        name="topic"
                                        render={() => (
                                            <FormItem>
                                                {topics.map((item: any) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="topic"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(
                                                                                item.id
                                                                            )}
                                                                            onCheckedChange={(
                                                                                checked
                                                                            ) => {
                                                                                return checked
                                                                                    ? field.onChange(
                                                                                          [
                                                                                              ...field.value,
                                                                                              item.id,
                                                                                          ]
                                                                                      )
                                                                                    : field.onChange(
                                                                                          field.value?.filter(
                                                                                              (
                                                                                                  value
                                                                                              ) =>
                                                                                                  value !==
                                                                                                  item.id
                                                                                          )
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger type="button">
                                Thời lượng
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[430px] gap-3 p-4 ">
                                    <FormField
                                        control={form.control}
                                        name="duration"
                                        render={() => (
                                            <FormItem>
                                                {durations.map((item: any) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="duration"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(
                                                                                item.id
                                                                            )}
                                                                            onCheckedChange={(
                                                                                checked
                                                                            ) => {
                                                                                return checked
                                                                                    ? field.onChange(
                                                                                          [
                                                                                              ...field.value,
                                                                                              item.id,
                                                                                          ]
                                                                                      )
                                                                                    : field.onChange(
                                                                                          field.value?.filter(
                                                                                              (
                                                                                                  value
                                                                                              ) =>
                                                                                                  value !==
                                                                                                  item.id
                                                                                          )
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger type="button">
                                Cấp độ
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[430px] gap-3 p-4 ">
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={() => (
                                            <FormItem>
                                                {levels.map((item: any) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="level"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(
                                                                                item.id
                                                                            )}
                                                                            onCheckedChange={(
                                                                                checked
                                                                            ) => {
                                                                                return checked
                                                                                    ? field.onChange(
                                                                                          [
                                                                                              ...field.value,
                                                                                              item.id,
                                                                                          ]
                                                                                      )
                                                                                    : field.onChange(
                                                                                          field.value?.filter(
                                                                                              (
                                                                                                  value
                                                                                              ) =>
                                                                                                  value !==
                                                                                                  item.id
                                                                                          )
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </form>
        </Form>
    );
};

export default DropBarFilter;
