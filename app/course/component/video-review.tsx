'use client';

import { Chapter } from '@/app/types';
import ReactPlayer from 'react-player';

interface VideoListProps {
    data?: Chapter[];
    indexChapter: number;
    indexLesson: number;
}

const VideoReview: React.FC<VideoListProps> = ({ data, indexChapter, indexLesson }) => {

    return (
        <div>
            <div className="pt-[50%] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-0 rounded-lg">
                    <ReactPlayer width="100%" url="sdsd" controls />
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
