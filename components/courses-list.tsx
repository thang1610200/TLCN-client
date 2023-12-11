import { Course, Topic } from '@/app/types';
import { CourseCard } from '@/components/course-card';

type CourseWithProgressWithCategory = Course & {
    topic: Topic | null;
    chapters: { id: string }[];
};

interface CoursesListProps {
    items?: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
    return (
        <div className='col-span-5'>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items?.map((item, index) => (
                    <CourseCard
                        key={index}
                        slug={item.slug}
                        title={item.title}
                        imageUrl={item.picture!}
                        chaptersLength={item.chapters.length}
                        category={item?.topic?.title}
                        chapter={item.chapters}
                    />
                ))}
            </div>
            {items?.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    );
};
