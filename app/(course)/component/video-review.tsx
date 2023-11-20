'use client';

import { Lesson } from '@/app/types';
import ReactPlayer from 'react-player';
import { Lock } from 'lucide-react';
import { Banner } from '@/components/banner';

interface VideoListProps {
    data?: Lesson;
    isLocked?: boolean;
}

const VideoReview: React.FC<VideoListProps> = ({ data, isLocked }) => {
    return (
        <div>
            {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            ) : (
                <div className="aspect-video relative overflow-hidden border-2">
                    <div className="absolute top-0 left-0 w-full h-full rounded-lg">
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            light={data?.thumbnail}
                            url={data?.videoUrl}
                            controls
                        />
                    </div>
                </div>
            )}
            {/* <div className="flex items-center justify-center">
        <Link href="/" className="px-4 py-2 my-3 font-bold text-white bg-red-500 rounded-full hover:bg-red-700">
            Enter to course
        </Link>
    </div> */}
        </div>
    );
};

export default VideoReview;
