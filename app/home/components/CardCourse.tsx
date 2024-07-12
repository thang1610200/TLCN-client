import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Star, Timer } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { Chapter } from '@/app/types';
import { Separator } from '@/components/ui/separator';
import { CardBody, CardContainer, CardItem } from "@/components/3d-card";


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
        <Link href={`/course/${slug}`} className='w-full h-full '>
            <CardContainer className="w-full h-full inter-var">
                <CardBody className="w-full h-full bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl border  ">
                    <CardItem
                        translateZ="50"
                        className="grid items-start justify-start w-full h-full grid-cols-3 gap-4 p-4 overflow-hidden rounded-lg group">
                        <>
                            <div className="relative flex col-span-1 overflow-hidden rounded-md max-w-52 h-36">
                                <Image
                                    priority={true}
                                    fill
                                    className="flex object-cover object-center aspect-video"
                                    alt={title}
                                    src={imageUrl}
                                    sizes="(max-width: 768px) 6rem, 13rem"

                                />
                               
                            </div>
                            <div className="flex flex-col items-start justify-between w-full h-full col-span-2">
                                <div className="text-xs font-bold transition lg:text-lg line-clamp-2 ">
                                    {title}
                                </div>
                                <div className="text-xs font-light lg:text-sm line-clamp-2">{description}.</div>
                              
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
                                </div>
                            </div>
                        </>
                        <Separator orientation='vertical' />
                    </CardItem>
                </CardBody>
            </CardContainer>

        </Link>
    );
};
