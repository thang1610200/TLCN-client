"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Course } from "@/app/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constant";

interface ImageFormProps {
    initialData?: Course
    course_slug?: string;
    mutate: KeyedMutator<any>
};

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    image: z.any()
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

export const ImageForm = ({
    initialData,
    course_slug,
    mutate
}: ImageFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: ''
        }
    });
    const session = useSession();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        form.setValue("image","");
        setIsEditing((current) => !current);
    };

    const router = useRouter();

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        try {
            await axios.patch(`${BACKEND_URL}/course/update-picture`, {
                slug: course_slug,
                file: values.image[0],
                email: session.data?.user.email
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Course updated");
            toggleEdit();
            mutate();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <>
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course image
            <Button onClick={toggleEdit} variant="ghost">
            {isEditing && (
                <>Cancel</>
            )}
            {!isEditing && !initialData?.picture && (
                <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add an image
                </>
            )}
            {!isEditing && initialData?.picture && (
                <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
                </>
            )}
            </Button>
        </div>
        {!isEditing && (
            !initialData?.picture ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
            ) : (
            <div className="relative aspect-video mt-2">
                <Image
                alt="Upload"
                fill
                className="object-cover rounded-md"
                src={initialData.picture}
                />
            </div>
            )
        )}
        {isEditing && (
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} accept="image/*" type="file" {...form.register("image")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                            {/* <Button disabled={!isValid || isSubmitting} type="button">Cancel</Button> */}
                        </div>
                    </form>
                </Form>
                <div className="text-xs text-muted-foreground mt-4">
                    16:9 aspect ratio recommended
                </div>
            </div>
        )}
        </div>
        </>
    )
}