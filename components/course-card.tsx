import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Timer } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { sumBy } from 'lodash';
import { Chapter } from '@/app/types';

interface CourseCardProps {
    slug: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    category?: string;
    chapter?: Chapter[]
}

export const CourseCard = ({
    slug,
    title,
    imageUrl,
    chaptersLength,
    category,
    chapter
}: CourseCardProps) => {

    function convertTime(second: number): string {
        let hour: number = Math.floor(second / 3600);

        if (hour > 0) {
            let minute: number = Math.floor((second % 3600) / 60);

            return `${hour} h ${minute} m`;
        } else {
            let minute: number = Math.floor(second / 60);

            return `${minute} m`;
        }
    }

    var sumTimeCourse = 0;
    chapter?.map((item) => {
        sumTimeCourse += sumBy(item.lessons,'duration');
    })

    return (
        <Link href={`/course/${slug}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="my-3 flex items-center gap-x-5 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength}{' '}
                                {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500">
                        <IconBadge size="sm" icon={Timer} />
                        <span>{convertTime(sumTimeCourse)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
