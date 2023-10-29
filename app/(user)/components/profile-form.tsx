"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BiLogoFacebookCircle, BiLogoTiktok, BiLogoYoutube } from "react-icons/bi";
import { ProfileUser } from "@/app/types"
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import UserImageModal from "@/app/(user)/components/user-image-modal";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from 'next-auth/react';

// const MAX_FILE_SIZE = 1000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    bio: z.string().max(160).optional(),
    urls: z
        .array(
            z.object({
                value: z.string(),
            })
        )
        .optional()
        .default([]),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileUserProps {
    user: ProfileUser,
    token?: string
}

const ProfileForm: React.FC<ProfileUserProps> = ({
    user,
    token
}) => {
    const FB = "https://www.facebook.com/";
    const YTB = "https://www.youtube.com/";
    const TT = "https://www.tiktok.com/";
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);

    const router = useRouter();
    const { update, data: session } = useSession();
    const defaultValues: Partial<ProfileFormValues> = {
        username: user.name,
        bio: user.bio || "",
        urls: [
            { value: user.facebook_id || "" },
            { value: user.youtube_id || "" },
            { value: user.titok_id || "" },
        ],
        email: user.email,
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    })

    const { fields, append } = useFieldArray({
        name: "urls",
        control: form.control,
    })

    function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);

        axios.patch(`${BACKEND_URL}/user/profile`, {
            email: user.email,
            username: data.username,
            bio: data.bio,
            facebook_id: data.urls[0].value,
            youtube_id: data.urls[1].value,
            tiktok_id: data.urls[2].value
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((res: any) => {
                toast.success("Update success!");
                update({
                    user: {
                        ...session?.user,
                        image: res.data.image as string,
                        name: res.data.name as string
                    }
                });
                router.refresh();
            })
            .catch((err: AxiosError<any, any>) => {
                if (err.response?.status === 401) {
                    router.push('/login');
                }
                else {
                    toast.error(err.response?.data?.message || "Error");
                }
            })
            .finally(() => setIsLoading(false));
    }


    const handleInstructor = () => {
        setIsLoadingRegister(true);
        axios.patch(`${BACKEND_URL}/user/register-instructer`, {
            email: user.email
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(() => {
            toast.success('Registration Instructor success');   
            router.refresh();
        })
            .catch(() => {
                toast.error('Registration Instructor failed!');
            })
            .finally(() => setIsLoadingRegister(false));
    }

    const handleCancel = () => {
        form.reset();
    }
    return (
        <>
            <div className="p-10 border-4 rounded-lg lg:max-w-2xl">
                <Form {...form}>
                    <UserImageModal data={user} token={token} />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Username" {...form.register("username")} />
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={true} placeholder="m@example.com" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600" {...form.register("email")} />
                                    </FormControl>
                                    <FormDescription>
                                        You can manage verified email addresses in your email settings.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...form.register("bio")}
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
                        <div>
                            {fields.map((field, index) => (
                                <FormField
                                    control={form.control}
                                    key={field.id}
                                    name={`urls.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                                                URLs
                                            </FormLabel>
                                            <FormDescription className={cn(index !== 0 && "sr-only")}>
                                                Add links to your website, blog, or social media profiles.
                                            </FormDescription>
                                            <div className="grid grid-cols-12 col-span-3 ">
                                                <BiLogoFacebookCircle hidden={index !== 0} className="w-[40px] h-[40px] col-span-1" />
                                                <BiLogoYoutube hidden={index !== 1} className="w-[40px] h-[40px] col-span-1" />
                                                <BiLogoTiktok hidden={index !== 2} className="w-[40px] h-[40px] col-span-1" />
                                                <Input className="col-span-4" disabled value={cn(index === 0 ? FB : (index === 1 ? YTB : TT))} />
                                                <FormControl>
                                                    <Input className="col-span-7" disabled={isLoading} placeholder="Resource ID" {...form.register(`urls.${index}.value`)} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            ))}
                            {/* <Button
                        disabled={isLoading}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ value: "" })}
                    >
                        Add URL
                    </Button> */}
                        </div>
                        <div className="grid w-3/4 grid-cols-3 gap-10">
                            {/* <Button type="button" onClick={() => { setIsDisable(false) }}>Update Profile</Button> */}
                            <Button type="submit" disabled={isLoading} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed" >{isLoading ? <Loader /> : 'Submit'}</Button>
                            <Button type="button" onClick={handleCancel} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed">Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
            {user.role === "LEARNER" &&
                <div className="relative grid justify-center grid-cols-2 grid-rows-2 p-10 border-4 rounded-lg align-items lg:max-w-2xl">
                    <h2 className="text-2xl font-bold tracking-tight ">Instructor</h2>
                    <Button type="button" disabled={isLoadingRegister} className="row-span-2 mt-3" onClick={handleInstructor}>{isLoadingRegister ? <Loader /> : 'Register'}</Button>
                    <p className="text-muted-foreground ">Do you want become Instructor</p>
                </div>
            }
        </>
    )
};

export default ProfileForm;