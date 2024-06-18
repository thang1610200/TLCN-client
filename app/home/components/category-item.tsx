'use client';

import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

interface CategoryItemProps {
    label: string;
    value?: string;
}

export const CategoryItem = ({
    label,
    value,
}: CategoryItemProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTopic = searchParams.get('topic');
    const currentTitle = searchParams.get('title');

    const isSelected = currentTopic === value || (!currentTopic && value === "all");

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: "",
                query: {
                    title: currentTitle,
                    topic: isSelected ? null : value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );

        value === "all" ? router.push('/') : router.push(url);
    };
    
    return (
        <button
            onClick={onClick}
            className={cn(
                'py-2 px-3 text-sm border border-slate-200 rounded-md flex items-center gap-x-1 hover:border-sky-700 transition',
                isSelected && 'border-sky-700 bg-sky-200/20 text-sky-800'
            )}
            type="button"
        >
            <div className="truncate text-xs font-semibold">{label}</div>
        </button>
    );
};
