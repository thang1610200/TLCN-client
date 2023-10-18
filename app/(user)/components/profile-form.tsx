"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
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
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { Session } from "inspector";



const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
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
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .optional(),
    image: z
        .any()
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 10MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional(),

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
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const defaultValues: Partial<ProfileFormValues> = {
        username: user.name,
        bio: user.bio || "",
        urls: user.url.length !== 0 ? user.url.map(value => ({ value })) : [
            { value: "https://www.facebook.com/user/" },
            { value: "https://www.youtube.com/@user" },
            { value: "https://www.tiktok.com/@user" },
        ],
        email: user.email,
        image: user.image,
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
        console.log(data.email);
        console.log(data.username);
        console.log(data.bio);
        console.log(data.urls);
        console.log(data.image);

        // axios.patch(`${BACKEND_URL}/user/profile`, {
        //     email: user.email,
        //     username: data.username,
        //     bio: data.bio,
        //     url: data.urls?.map(item => item.value),
        //     image: data.image,
        // }, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then(() => {
        //         toast.success("Update success!");
        //     })
        //     .catch((err: AxiosError<any, any>) => {
        //         if (err.response?.status === 401) {
        //             router.push('/login');
        //         }
        //         else {
        //             toast.error(err.response?.data?.message || "Error");
        //         }
        //     })
        //     .finally(() => setIsLoading(false));
    }


    const [isDisable, setIsDisable] = useState(true)
    const [isHidden, setIsHidden] = useState(true)
    const handleChangeImage = () => {
        if (isHidden === true) {
            setIsHidden(false);
            setIsDisable(false);
        }
        else {
            setIsHidden(true);
        }
    }
    const handleCancel = () => {
        form.reset();
        setIsDisable(true);
    }
    return (
        <Form {...form}>

            <div className="flex justify-center ">
                <div className="w-[150px] h-[150px] relative">
                    <img src={user.image.toString()} className="w-full rounded-full" />
                    <Button onClick={handleChangeImage} className="absolute bottom-0 right-0 w-10 h-10 text-xl text-white rounded-full bg-slate-400">＋</Button>
                </div>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem hidden={isHidden}>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input disabled={isDisable} accept="image/*" type="file" {...form.register("image")} />
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
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input disabled={isDisable} placeholder="shadcn" {...form.register("username")} />
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
                                <Input disabled={isDisable} placeholder="m@example.com" className="invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-2 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-600" {...form.register("email")} />
                            </FormControl>
                            <FormDescription>
                                You can manage verified email addresses in your email settings.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
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
                /> */}
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
                                    <div className="grid grid-cols-12 ">
                                        <BiLogoFacebookCircle hidden={index !== 0} className="w-[40px] h-[40px]" />
                                        <BiLogoYoutube hidden={index !== 1} className="w-[40px] h-[40px]" />
                                        <BiLogoTiktok hidden={index !== 2} className="w-[40px] h-[40px]" />
                                        <FormControl>
                                            <Input className="col-span-11" disabled={isDisable} placeholder="shadcn" {...form.register(`urls.${index}.value`)} />
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
                    <Button type="button" onClick={() => { setIsDisable(false) }}>Update Profile</Button>
                    <Button type="submit" disabled={isDisable} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed" >{isLoading ? <Loader /> : 'Submit'}</Button>
                    <Button type="button" onClick={handleCancel} disabled={isDisable} className="flex disabled:bg-slate-200 disabled:cursor-not-allowed">Cancel</Button>
                </div>
            </form>


        </Form>
    )
};

export default ProfileForm;