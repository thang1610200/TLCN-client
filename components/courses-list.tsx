import { Course, Topic } from '@/app/types';
import { CourseCard } from '@/components/course-card';

type CourseWithProgressWithCategory = Course & {
    topic: Topic | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items?: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items?.map((item) => (
                    <CourseCard
                        key={item.slug}
                        slug={item.slug}
                        title={item.title}
                        imageUrl={item.picture!}
                        chaptersLength={item.chapters.length}
                        progress={item.progress}
                        category={item?.topic?.title}
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
