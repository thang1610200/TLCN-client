"use client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Grip, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/app/types";

interface LessonsListProps {
    items: Lesson[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
};

const formSchema = z.object({
    question: z.string().min(1),
    answer: z.string().array().min(1),
});

export const QuizzList = () => {
    const array: string[] = ["A", "B", "C", "D"];
    const quizz: number[] = [1, 2, 3];
    const [isEditing, setIsEditing] = useState(false);
    console.log(quizz)
    // const [isMounted, setIsMounted] = useState(false);
    // const [lessons, setLessons] = useState(items);

    // useEffect(() => {
    //     setIsMounted(true);
    // }, []);

    // useEffect(() => {
    //     setLessons(items);
    // }, [items]);

    // const onDragEnd = (result: DropResult) => {
    //     if (!result.destination) return;

    //     const items = Array.from(lessons);
    //     const [reorderedItem] = items.splice(result.source.index, 1);
    //     items.splice(result.destination.index, 0, reorderedItem);

    //     const startIndex = Math.min(result.source.index, result.destination.index);
    //     const endIndex = Math.max(result.source.index, result.destination.index);

    //     const updatedLessons = items.slice(startIndex, endIndex + 1);

    //     setLessons(items);

    //     const bulkUpdateData = updatedLessons.map((lesson) => ({
    //         id: lesson.id,
    //         position: items.findIndex((item) => item.id === lesson.id)
    //     }));

    //     onReorder(bulkUpdateData);
    // }

    // if (!isMounted) {
    //     return null;
    // }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Submit");
        // try {
        //     await axios.patch(`${BACKEND_URL}/lesson/update-lesson`, {
        //         course_slug: course_slug,
        //         value: {
        //             title: values.title
        //         },
        //         email: session.data?.user.email,
        //         chapter_token,
        //         lesson_token
        //     },{
        //         headers: {
        //             Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
        //             "Content-Type": "application/json"
        //         }
        //     });
        //     toast.success("Lesson updated");
        //     toggleEdit();
        //     mutate();
        //     router.refresh();
        // } catch {
        //     toast.error("Something went wrong");
        // }
    }

    return (
        <div className="grid gap-2 p-4 ">
            <div className="flex">
                {isEditing ? <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className=""
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the lesson'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form> : <div className="p-4 text-xl rounded-lg bg-slate-300 ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet, nulla vel hendrerit dictum, justo tortor fermentum magna, at fringilla metus augue at mauris.
                </div>}
            </div>
            <div className="flex items-center justify-center ">
                <div className="grid w-1/2 grid-flow-row gap-2 ">
                    {isEditing ? <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-4 space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Introduction to the lesson'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form> : <div className="text-lg text-center rounded-lg bg-slate-400 hover:bg-slate-700">A. Donec at massa at mi ultrices finibus vel quis dui</div>}
                </div>

            </div>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 ">
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                    <Button onClick={() => { setIsEditing(!isEditing) }} variant="ghost">
                        {isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Q&A
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div >
        // <DragDropContext onDragEnd={onDragEnd}>
        //     <Droppable droppableId="chapters">
        //         {(provided) => (
        //         <div {...provided.droppableProps} ref={provided.innerRef}>
        //             {lessons.map((lesson, index) => (
        //             <Draggable 
        //                 key={lesson.id} 
        //                 draggableId={lesson.id} 
        //                 index={index}
        //             >
        //                 {(provided) => (
        //                 <div
        //                     className={cn(
        //                     "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
        //                     lesson.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
        //                     )}
        //                     ref={provided.innerRef}
        //                     {...provided.draggableProps}
        //                 >
        //                     <div
        //                     className={cn(
        //                         "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
        //                         lesson.isPublished && "border-r-sky-200 hover:bg-sky-200"
        //                     )}
        //                     {...provided.dragHandleProps}
        //                     >
        //                     <Grip
        //                         className="w-5 h-5"
        //                     />
        //                     </div>
        //                     {lesson.title}
        //                     <div className="flex items-center pr-2 ml-auto gap-x-2">
        //                     <Badge
        //                         className={cn(
        //                         "bg-slate-500",
        //                         lesson.isPublished && "bg-sky-700"
        //                         )}
        //                     >
        //                         {lesson.isPublished ? "Published" : "Draft"}
        //                     </Badge>
        //                     <Pencil
        //                         onClick={() => onEdit(lesson.token)}
        //                         className="w-4 h-4 transition cursor-pointer hover:opacity-75"
        //                     />
        //                     </div>
        //                 </div>
        //                 )}
        //             </Draggable>
        //             ))}
        //             {provided.placeholder}
        //         </div>
        //         )}
        //     </Droppable>
        // </DragDropContext>
    )
}