"use client"

import { useState, useEffect } from "react"
import Link from "next/link"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import qs from 'query-string';

    
const ratings: { id: string, label: string }[] = [
    {
        id: "4.5",
        label: "Từ 4.5 sao trở lên",
    },
    {
        id: "4.0",
        label: "Từ 4 sao trở lên",
    },
    {
        id: "3.5",
        label: "Từ 3.5 sao trở lên",
    },
    {
        id: "3.0",
        label: "Từ 3 sao trở lên",
    },
]

const topics: { id: string, label: string }[] = [
    {
        id: "nextjs",
        label: "NextJS",
    },
    {
        id: "javascript",
        label: "Javascript",
    },
    {
        id: "html",
        label: "HTML",
    },
    {
        id: "css",
        label: "CSS",
    },
    {
        id: "reactjs",
        label: "ReactJS",
    },
]

const durations: { id: string, label: string }[] = [
    {
        id: "extraShort",
        label: "0-1 giờ",
    },
    {
        id: "short",
        label: "1-3 giờ",
    },
    {
        id: "medium",
        label: "3-6 giờ",
    },
    {
        id: "long",
        label: "6-17 giờ",
    },
    {
        id: "extraLong",
        label: "Hơn 17 giờ",
    },
]

const levels: { id: string, label: string }[] = [
    {
        id: "all",
        label: "Tất cả trình độ",
    },
    {
        id: "beginner",
        label: "Sơ cấp",
    },
    {
        id: "intermediate",
        label: "Trung cấp",
    },
    {
        id: "expert",
        label: "Chuyên gia",
    },
]

const FormSchema = z.object({
    rating: z.array(z.string()).optional().default([]),
    duration: z.array(z.string()).optional().default([]),
    topic: z.array(z.string()).optional().default([]),
    level: z.array(z.string()).optional().default([]),
})


export default function DropBarFilter() {
    const router = useRouter()
    const searchParams = useSearchParams();

    const currentTitle = searchParams.get('title');
    const currentRating = searchParams.getAll('rating');
    const currentTopic = searchParams.getAll('topic');
    const currentDuration = searchParams.getAll('duration');
    const currentLevel = searchParams.getAll('level');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            rating: currentRating ? currentRating : [],
            topic: currentTopic ? currentTopic : [],
            duration: currentDuration ? currentDuration : [],
            level: currentLevel ? currentLevel : [],

        }
    })

    useEffect(() => {
        const subscription = form.watch((data) => {
            const url = qs.stringifyUrl(
                {
                    url: "",
                    query: {
                        title: currentTitle,
                        rating: data.rating ? data.rating : null,
                        topic: data.topic ? data.topic : null,
                        duration: data.duration ? data.duration : null,
                        level: data.level ? data.level : null,
                    },
                },
                { skipNull: true, skipEmptyString: true }
            );
            !url ? router.push("/") : router.push(url);
        }
        )
        return () => subscription.unsubscribe()

    }, [form, router, currentTitle])

    return (
        <Form {...form} >
            <form className="space-y-8">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger type="button">Xếp hạng</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[430px] gap-3 p-4 ">
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={() => (
                                            <FormItem>
                                                {ratings.map((item: any) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="rating"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
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
                            <NavigationMenuTrigger type="button">Chủ đề</NavigationMenuTrigger>
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
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
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
                            <NavigationMenuTrigger type="button">Thời lượng</NavigationMenuTrigger>
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
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
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
                            <NavigationMenuTrigger type="button">Cấp độ</NavigationMenuTrigger>
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
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
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

    )
}