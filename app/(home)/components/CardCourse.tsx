import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Star, Timer } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { sumBy } from 'lodash';
import { Chapter } from '@/app/types';
import { Separator } from '@/components/ui/separator';

interface CourseCardProps {
    slug: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    category?: string;
    chapter?: Chapter[]
}

const ratings: number = 4.7

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
        sumTimeCourse += sumBy(item.lessons, 'duration');
    })

    return (
        <Link href={`/course/${slug}`}>
            <div className="flex items-start justify-start w-full h-full gap-4 p-4 overflow-hidden rounded-lg group">
                <div className="relative overflow-hidden rounded-md min-w-52 max-w-52 h-36">
                    <Image
                        priority={true}
                        fill
                        className="object-cover object-center aspect-video"
                        alt={title}
                        src={imageUrl}

                    />
                    {/* <Image src="/images/learning.jpg" alt='image product' width={100} height={100} className='mix-blend-multiply' /> */}
                </div>
                <div className="flex flex-col">
                    <div className="text-lg font-bold transition line-clamp-2 ">
                        {title}
                    </div>
                    <div className="text-sm font-light line-clamp-2"> Description Reprehenderit dolore laboris aliqua sit non aliqua dolor.</div> {/*Thêm description */}
                    {/* <p className="text-xs text-muted-foreground">{category}</p> */}
                    <p className="text-sm text-muted-foreground">Tác giả</p> {/*Thêm tác giả*/}
                    <div className="flex items-center my-3 text-sm gap-x-5 md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength}{' '}
                                {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500 ">
                            <IconBadge size="sm" icon={Timer} />
                            <span>{convertTime(sumTimeCourse)}</span>
                        </div>
                        <div className="flex items-center justify-center ">
                            {[1, 2, 3, 4, 5].map((items) => (
                                <div key={items} className="">
                                    {items < ratings ? <Star size="20" fill='#0369a1' strokeWidth={0} /> : <Star size="20" color='#0369a1' />}
                                    
                                </div>
                            ))}
                            {ratings}
                        </div>
                    </div>
                </div>
            </div>
            <Separator orientation='vertical' />
        </Link>
    );
};
