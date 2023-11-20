import { KeyedMutator } from "swr";
import { columns_lesson } from "./columns-lesson";
import { DataTableLesson } from "./table-lesson";
import { Exercise } from "@/app/types";

interface ExerciseLessonProps {
    initialData?: Exercise[];
    token?: string;
    mutate: KeyedMutator<any>;
}

export const ExerciseLesson = ({
    initialData,
    token,
    mutate,
}: ExerciseLessonProps) => {
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Exercise Lesson
            </div>
            <div className="mt-2">
                {/* <DataTableLesson columns={columns_lesson} data={initialData} /> */}
            </div>
        </div>
    );
}