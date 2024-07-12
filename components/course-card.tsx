import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
    slug: string;
    title: string;
    imageUrl: string;
    chaptersLength?: number;
    total?: number;
    description?: string;
    progress: number;
}

export const CourseCard = ({
    slug,
    title,
    imageUrl,
    description,
    progress
}: CourseCardProps) => {

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
                    <div className="text-xs font-light lg:text-sm line-clamp-2">
                        {description}.
                    </div>{' '}
                    {/*Thêm description */}
                    {/* <p className="text-xs text-muted-foreground">{category}</p> */}
                    {/* <p className="text-xs lg:text-smtext-muted-foreground">Tác giả</p> */}
                    {/* <div className="flex items-center my-3 text-xs lg:text-sm gap-x-5 ">
                            <Progress hidden={false} value={progress} />
                        </div> */}
                    <div className='flex items-center justify-center w-full h-4 gap-4'>
                        <Progress className='h-2' value={progress} />
                        <div>{(progress.toFixed(0) || 0)}%</div>
                    </div>
                </div>
            </div>
            <Separator orientation="vertical" />
        </Link>
    );
};
