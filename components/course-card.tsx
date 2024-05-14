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
    // chapter?.map((item) => {
    //     sumTimeCourse += sumBy(item.lessons,'duration');
    // })

    return (
        <Link href={`/course/${slug}`}>
            <div className="w-full h-full p-3 overflow-hidden transition border rounded-lg group hover:shadow-sm">
                <div className="relative w-full overflow-hidden rounded-md aspect-video">
                    <Image
                        priority={true}
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg font-medium transition md:text-base group-hover:text-sky-700 line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="flex items-center my-3 text-sm gap-x-5 md:text-xs">
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
