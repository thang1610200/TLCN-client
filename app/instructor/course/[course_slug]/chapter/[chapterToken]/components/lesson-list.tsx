"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Content, Lesson } from "@/app/types";
import toast from "react-hot-toast";

interface LessonsListProps {
    items: Content[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (content: Content) => void;
    coursePublished?: boolean;
};

export const LessonsList = ({
    items,
    onReorder,
    onEdit,
    coursePublished
}: LessonsListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [contents, setContents] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setContents(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        if(!coursePublished){
            const items = Array.from(contents);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const startIndex = Math.min(result.source.index, result.destination.index);
            const endIndex = Math.max(result.source.index, result.destination.index);

            const updatedLessons = items.slice(startIndex, endIndex + 1);

            setContents(items);

            const bulkUpdateData = updatedLessons.map((lesson) => ({
                id: lesson.id,
                position: items.findIndex((item) => item.id === lesson.id)
            }));

            onReorder(bulkUpdateData);
        }
        else {
            toast.error('Khóa học đang được publish');
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {contents.map((content, index) => (
                    <Draggable 
                        key={content.id} 
                        draggableId={content.id} 
                        index={index}
                    >
                        {(provided) => (
                        <div
                            className={cn(
                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                            (content.lesson?.isPublished || content.exercise?.isOpen) && "bg-sky-100 border-sky-200 text-sky-700"
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            <div
                            className={cn(
                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                (content.lesson?.isPublished || content.exercise?.isOpen) && "border-r-sky-200 hover:bg-sky-200"
                            )}
                            {...provided.dragHandleProps}
                            >
                            <Grip
                                className="h-5 w-5"
                            />
                            </div>
                            {(content.lesson?.title || content.exercise?.title)}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                            <Badge
                                className={cn(
                                "bg-slate-500",
                                (content.lesson?.isPublished || content.exercise?.isOpen) && "bg-sky-700"
                                )}
                            >
                                {(content.lesson?.isPublished || content.exercise?.isOpen) ? "Published" : "Draft"}
                            </Badge>
                            <Pencil
                                onClick={() => onEdit(content)}
                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                            />
                            </div>
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}