import { Button } from '@/components/ui/button';
import React from 'react';

interface OutputWindowProps {
    outputDetails: string;
}

const OutputWindow: React.FC<OutputWindowProps> = ({ outputDetails }) => {
    const getOutput = () => {
        let statusId = outputDetails;

        if (statusId === '1') {
            // compilation error
            return (
                <pre className="px-2 py-1 text-xs font-normal text-red-500">
                    Fail
                </pre>
            );
        } else if (statusId === '2') {
            return (
                <pre className="px-2 py-1 text-xs font-normal text-green-500">
                    Success
                </pre>
            );
        }
        else if (statusId === '3') {
            return (
                <pre className="px-2 py-1 text-xs font-normal text-green-500">
                    Complete exercise
                </pre>
            );
        }
        // } else if (statusId === 5) {
        //     return (
        //         <pre className="px-2 py-1 text-xs font-normal text-red-500">
        //             {`Time Limit Exceeded`}
        //         </pre>
        //     );
        // } else {
        //     return (
        //         <pre className="px-2 py-1 text-xs font-normal text-red-500">
        //             {atob(outputDetails?.stderr)}
        //         </pre>
        //     );
        // }
    };
    return (
        <>
            <div className="bg-[#1e293b] rounded-md text-white font-normal text-sm  w-full h-full">
                {outputDetails ? <>{getOutput()}</> : null}
            </div>
        </>
    );
};

export default OutputWindow;
