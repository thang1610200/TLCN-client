"use client";

import { Lesson } from '@/app/types';
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";

interface ResourcesLessonProps {
    lesson?: Lesson;
}

const ResourcesLesson: React.FC<ResourcesLessonProps> = ({ lesson }) => {
    return (
        <>
            <Separator />
            <div className="p-4">
                {lesson?.attachment?.map((attachment) => (
                    <a
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                        <File />
                        <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                ))}
            </div>
        </>
    );
};

export default ResourcesLesson;
