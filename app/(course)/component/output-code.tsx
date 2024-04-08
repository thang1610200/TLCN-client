import { Button } from '@/components/ui/button';
import React from 'react';

interface OutputWindowProps {
    outputDetails?: any;
}

const OutputWindow: React.FC<OutputWindowProps> = ({ outputDetails }) => {
    const getOutput = () => {
        let statusId = outputDetails?.status?.id;

        if (statusId === 6) {
            // compilation error
            return (
                <pre className="px-2 py-1 font-normal text-xs text-red-500">
                    {atob(outputDetails?.compile_output)}
                </pre>
            );
        } else if (statusId === 3) {
            return (
                <pre className="px-2 py-1 font-normal text-xs text-green-500">
                    {atob(outputDetails.stdout) !== null
                        ? `${atob(outputDetails.stdout)}`
                        : null}
                </pre>
            );
        } else if (statusId === 5) {
            return (
                <pre className="px-2 py-1 font-normal text-xs text-red-500">
                    {`Time Limit Exceeded`}
                </pre>
            );
        } else {
            return (
                <pre className="px-2 py-1 font-normal text-xs text-red-500">
                    {atob(outputDetails?.stderr)}
                </pre>
            );
        }
    };
    return (
        <>
            <div className="bg-[#1e293b] rounded-md text-white font-normal text-sm h-[60%]">
                {outputDetails ? <>{getOutput()}</> : null}
            </div>
        </>
    );
};

export default OutputWindow;
