"use client";

import qs from "query-string";
import { useState } from 'react';
import { Input } from './ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchInput = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTopic = searchParams.get('topic');
    const currentTitle = searchParams.get('title');
    const [value, setValue] = useState(currentTitle || "");

    function onSubmit (event: React.KeyboardEvent) {
        if(event.key === "Enter"){
            const url = qs.stringifyUrl(
                {
                    url: "/",
                    query: {
                        title: value,
                        topic: currentTopic,
                    },
                },
                { skipNull: true, skipEmptyString: true }
            );
    
            router.push(url);
        }
    }

    return (
        <Input
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            onKeyDown={onSubmit}
            type="search"
            value={value}
            placeholder="Tìm kiếm khóa học"
            className="w-full h-full text-sm rounded-xl bg-slate-100 focus-visible:ring-slate-200"
        />
    );
};

export default SearchInput;
