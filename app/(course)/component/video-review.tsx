import { Lesson } from '@/app/types';
import ReactPlayer from 'react-player';
import { Lock } from 'lucide-react';
import { TrackProps } from 'react-player/file';
import { useMemo } from 'react';

interface VideoListProps {
    data?: Lesson;
    isLocked?: boolean;
}

const VideoReview: React.FC<VideoListProps> = ({ data, isLocked }) => {
    const tracks: TrackProps[] = useMemo(() => {
        if(!data?.subtitles) return [];
        return data?.subtitles.map((item) => {
            return {
                kind: "subtitles",
                src: item.file,
                srcLang: item.language_code,
                label: item.language
            }
        })
    },[data])

    return (
        <div>
            {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p className="text-sm">This lesson is locked</p>
                </div>
            ) : (
                <div className="relative overflow-hidden aspect-video">
                    <div className="absolute top-0 left-0 w-full h-full rounded-lg">
                        {data?.videoUrl && (
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                light={data?.thumbnail}
                                url={data?.videoUrl}
                                controls
                                playing
                                config={{
                                    file: {
                                        attributes: {
                                            crossOrigin: "true"
                                        },
                                        tracks
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoReview;
