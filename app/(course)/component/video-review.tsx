'use client';

import { Lesson } from '@/app/types';
import ReactPlayer from 'react-player';
import { find } from 'lodash';

interface VideoListProps {
    data?: Lesson[];
    tokenLesson?: string;
}

const VideoReview: React.FC<VideoListProps> = ({ data, tokenLesson }) => {
    const lesson = find(data, {token: tokenLesson});

    return (
        <div>
            <div className="pt-[50%] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full rounded-lg">
                    <ReactPlayer width="100%" height="100%" light={lesson?.thumbnail} url={lesson?.videoUrl} controls />
                </div>
            </div>
            {/* <div className="flex items-center justify-center">
        <Link href="/" className="px-4 py-2 my-3 font-bold text-white bg-red-500 rounded-full hover:bg-red-700">
            Enter to course
        </Link>
    </div> */}
        </div>
    );
};

export default VideoReview;
