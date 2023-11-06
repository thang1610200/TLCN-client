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
import { KeyedMutator } from "swr";

interface ChapterActionsProps {
    disabled: boolean;
    course_slug: string;
    chapter_token: string;
    isPublished: boolean;
    mutate: KeyedMutator<any>
};

export const ChapterActions = ({
    disabled,
    course_slug,
    chapter_token,
    isPublished,
    mutate
}: ChapterActionsProps) => {
    const router = useRouter();
    const session = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`${BACKEND_URL}/chapter/update-status`,{
                status: isPublished,
                course_slug: course_slug,
                token: chapter_token,
                email: session.data?.user.email
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (isPublished) {
                toast.success("Chapter unpublished");
            } else {
                toast.success("Chapter published");
            }
            mutate();
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
        
            await axios.delete(`${BACKEND_URL}/chapter/delete-chapter?course_slug=${course_slug}&token=${chapter_token}&email=${session.data?.user.email}`,{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
        
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/instructor/course/${course_slug}`);
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