import { FileCode } from "@/app/types";
import { KeyedMutator } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { EditorForm } from "./editor-form";

interface TabFileProps {
    initialData: FileCode[];
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
}

export const TabFile: React.FC<TabFileProps> = ({
    initialData,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token
}) => {
    return (
        <div>
            <Tabs defaultValue={initialData[0]?.id}>
                <TabsList>
                    {
                        initialData?.map((item, index) => (
                            <TabsTrigger key={index} value={item.id}>{`${item.fileName}.${item.mime}`}</TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    initialData?.map((item, index) => (
                        <TabsContent key={index} value={item.id}>
                            <EditorForm
                                chapter_token={chapter_token}
                                course_slug={course_slug}
                                code_token={code_token}
                                exercise_token={exercise_token}
                                mutate={mutate}
                                language={item.language}
                                defaultValue={item.default_content}
                                fileId={item.id}
                            />
                        </TabsContent>
                    ))
                }

            </Tabs>
        </div>
    );
}