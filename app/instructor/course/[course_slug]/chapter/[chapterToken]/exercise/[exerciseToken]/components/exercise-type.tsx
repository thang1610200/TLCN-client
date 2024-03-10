'use client';

import { TypeExercise } from "@/app/types";

interface TitleFormProps {
    initialData?: {
        type: TypeExercise
    };
}

export const ExerciseTypeForm = ({
    initialData,
}: TitleFormProps) => {
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Exercise type
            </div>
           <p className="text-sm mt-2">{initialData?.type}</p>
        </div>
    );
};
