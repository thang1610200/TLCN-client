'use client';

import React, { Fragment, useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from '@headlessui/react'
import { Button } from "@/components/ui/button";
import { BiPlusCircle } from "react-icons/bi"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"
import Loader from "@/components/loader";

import * as z from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(100, {
            message: "Username must not be longer than 100 characters.",
        }),
    description: z
        .string()
        .min(2, {
            message: "Description must be at least 2 characters.",
        })
        .max(500, {
            message: "Description must not be longer than 500 characters.",
        }),
    learning_outcome: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(100, {
            message: "Username must not be longer than 100 characters.",
        }),
    // picture: z.any()
    //     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 10MB.`)
    //     .refine(
    //         (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    //         "Only .jpg, .jpeg, .png and .webp formats are supported."
    //     )
})


type ProfileFormValues = z.infer<typeof profileFormSchema>



export default function CreateCourseModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);


    const defaultValues: Partial<ProfileFormValues> = {
        name: "Python",
        description: "This course will teach about python",
        learning_outcome: "Build a website with python",
        // picture: ""
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    })


    function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);


    }


    const handleCancel = () => {
        form.reset();
        setIsOpen(false)
    }


    let [isOpen, setIsOpen] = useState(false);
    const setLearnerToInstructor = () => {
        console.log("Set Learner to Instructor");
        setIsOpen(false);
        //set role = instructor
        //link to instructor page
    }
    return (
        <div>
            <div className="ml-auto mr-4" onClick={() => setIsOpen(true)}>
                <Button>
                    <BiPlusCircle className="w-4 h-4 mr-2" />
                    Add New Course
                </Button>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10 w-80" onClose={() => { setIsOpen(false) }}>
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
                                        Create New Course
                                    </Dialog.Title>
                                    <div className="w-full p-10 border-4 rounded-lg ">
                                        <Form {...form}>

                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={isLoading} placeholder="name" {...form.register("name")} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                This is your public display name. It can be your real name or a
                                                                pseudonym.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Bio</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={isLoading}
                                                                    placeholder="Tell us a little bit about yourself"
                                                                    className="resize-none"
                                                                    {...form.register("description")}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                You can <span>@mention</span> other users and organizations to
                                                                link to them.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="learning_outcome"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={true} placeholder="learning_outcome" {...form.register("learning_outcome")} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                You can manage verified email addresses in your email settings.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid w-full grid-cols-2 px-10 gap-x-10 ">
                                                    {/* <Button type="button" onClick={() => { setIsDisable(false) }}>Update Profile</Button> */}
                                                    <Button type="submit" disabled={isLoading} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed" >{isLoading ? <Loader /> : 'Submit'}</Button>
                                                    <Button type="button" onClick={handleCancel} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed">Cancel</Button>
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
    )
}
