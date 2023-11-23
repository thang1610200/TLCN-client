import { Lesson } from '@/app/types';
import ReactPlayer from 'react-player/lazy';
import { Lock } from 'lucide-react';

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
                        {data?.videoUrl && (
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                light={data?.thumbnail}
                                url={data?.videoUrl}
                                controls
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoReview;
