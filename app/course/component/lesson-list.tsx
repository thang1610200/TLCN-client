"use client";

import { Lesson } from "@/app/types";
import { useState } from "react";

interface LessonListProps {
    data: Lesson[]
}


const LessonList:React.FC<LessonListProps> = ({
    data
}) => {
    const [visibleSection, setVisibleSection] = useState<Set<string>>(new Set<string>());

    const videoSections: string[] = Array.from(new Set<string>(data.map((item) => item.videoUrl)));

    console.log(videoSections);

    return (
        <div>
            test
        </div>
    );
}

export default LessonList;