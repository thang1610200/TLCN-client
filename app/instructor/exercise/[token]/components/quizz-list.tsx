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
import { Quizz } from "@/app/types";

interface QuizzListProps {
    items: Quizz[];
    onReorder: (updateData: { token: string; position: number }[]) => void;
    onEdit: (id: string) => void;
};

export const QuizzList = ({
    items,
    onReorder,
    onEdit
}: QuizzListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [quizzs, setQuizzs] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setQuizzs(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(quizzs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedQuizzs = items.slice(startIndex, endIndex + 1);

        setQuizzs(items);

        const bulkUpdateData = updatedQuizzs.map((quizz) => ({
            token: quizz.token,
            position: items.findIndex((item) => item.token === quizz.token)
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {quizzs.map((quizz, index) => (
                    <Draggable 
                        key={quizz.token} 
                        draggableId={quizz.token} 
                        index={index}
                    >
                        {(provided) => (
                        <div
                            className={cn(
                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                            quizz.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            <div
                            className={cn(
                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                quizz.isPublished && "border-r-sky-200 hover:bg-sky-200"
                            )}
                            {...provided.dragHandleProps}
                            >
                            <Grip
                                className="h-5 w-5"
                            />
                            </div>
                            {quizz.question}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                            <Badge
                                className={cn(
                                "bg-slate-500",
                                quizz.isPublished && "bg-sky-700"
                                )}
                            >
                                {quizz.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Pencil
                                onClick={() => onEdit(quizz.token)}
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