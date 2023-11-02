"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { BACKEND_URL } from "@/lib/constant";
import { useSession } from "next-auth/react";

interface LessonActionsProps {
    disabled: boolean;
    course_slug: string;
    chapter_token: string;
    lesson_token: string;
    isPublished: boolean;
};

export const LessonActions = ({
    disabled,
    course_slug,
    chapter_token,
    lesson_token,
    isPublished
}: LessonActionsProps) => {
    const router = useRouter();
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`${BACKEND_URL}/lesson/update-status`,{
                status: isPublished,
                course_slug: course_slug,
                chapter_token,
                lesson_token,
                email: session.data?.user.email
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (isPublished) {
                toast.success("Lesson unpublished");
            } else {
                toast.success("Lesson published");
            }
        
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
  
    const onDelete = async () => {
        try {
            setIsLoading(true);
        
            await axios.delete(`${BACKEND_URL}/lesson/delete-lesson?course_slug=${course_slug}&chapter_token=${chapter_token}&email=${session.data?.user.email}&lesson_token=${lesson_token}`,{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
        
            toast.success("Lesson deleted");
            router.refresh();
            router.push(`/instructor/course/${course_slug}/chapter/${chapter_token}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
        >
            {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
            </Button>
        </ConfirmModal>
        </div>
    )
}