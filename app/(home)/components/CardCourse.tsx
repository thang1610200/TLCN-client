import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Star, Timer } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { Chapter } from '@/app/types';
import { Separator } from '@/components/ui/separator';

interface CourseCardProps {
    slug: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    total?: number;
    description?: string
}

export const CourseCard = ({
    slug,
    title,
    imageUrl,
    chaptersLength,
    total,
    description
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

    return (
        <Link href={`/course/${slug}`}>
            <div className="grid items-start justify-start w-full h-full grid-cols-3 gap-4 p-4 overflow-hidden rounded-lg group auto-cols-fr auto-rows-fr">
                <div className="relative flex col-span-1 overflow-hidden rounded-md max-w-52 h-36">
                    <Image
                        priority={true}
                        fill
                        className="flex object-cover object-center aspect-video"
                        alt={title}
                        src={imageUrl}
                        sizes="(max-width: 768px) 6rem, 13rem"

                    />
                    {/* <Image src="/images/learning.jpg" alt='image product' width={100} height={100} className='mix-blend-multiply' /> */}
                </div>
                <div className="flex flex-col items-start justify-between w-full h-full col-span-2">
                    <div className="text-xs font-bold transition lg:text-lg line-clamp-2 ">
                        {title}
                    </div>
                    <div className="text-xs font-light lg:text-sm line-clamp-2">{description}.</div> {/*Thêm description */}
                    {/* <p className="text-xs text-muted-foreground">{category}</p> */}
                    {/* <p className="text-xs lg:text-smtext-muted-foreground">Tác giả</p> */}
                    <div className="flex items-center my-3 text-xs lg:text-sm gap-x-5 ">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength}{' '}
                                lectures
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500 ">
                            <IconBadge size="sm" icon={Timer} />
                            <span>{convertTime(total || 0)}</span>
                        </div>
                        {/* <div className="flex items-center justify-center ">
                            {[1, 2, 3, 4, 5].map((items) => (
                                <div key={items} className="">
                                    {items < ratings ? <Star size="20" fill='#0369a1' strokeWidth={0} /> : <Star size="20" color='#0369a1' />}
                                    
                                </div>
                            ))}
                            {ratings}
                        </div> */}
                    </div>
                </div>
            </div>
            <Separator orientation='vertical' />
        </Link>
    );
};
