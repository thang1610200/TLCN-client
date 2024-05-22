import { Course, Topic } from '@/app/types';
// import { CourseCard } from '@/components/course-card';
import { CourseCard } from "./CardCourse"

interface CoursesListProps {
    items?: any[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
    if (items && items?.length === 0) {
        return (
            <div className="flex flex-row flex-wrap items-start justify-start w-full h-full overflow-hidden">
                <div className="mt-10 text-sm text-center text-muted-foreground">
                    No courses found
                </div>
            </div>
        )
    }
    return (
        <div className='flex flex-row flex-wrap items-start justify-start w-full overflow-hidden h-fit'>
            {items?.map((item, index) => (
                <div key={index} className="flex items-center justify-center w-1/2 h-48">
                    <CourseCard
                        key={index}
                        slug={item.slug}
                        title={item.title}
                        imageUrl={item.picture!}
                        chaptersLength={item.chapters.length}
                        total={item.total}
                        description={item.description}
                    />
                </div>
            ))}
        </div>
    );
};
