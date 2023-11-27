import { Lesson } from '@/app/types';
import { Preview } from '@/components/preview';

interface OverviewProps {
    lesson?: Lesson;
}

const Overview: React.FC<OverviewProps> = ({ lesson }) => {
    return (
        <div className="flex mt-3 pb-1 w-full">
            {lesson?.description && <Preview value={lesson?.description} />}
        </div>
    );
};

export default Overview;
