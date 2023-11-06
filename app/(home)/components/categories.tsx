'use client';

import { CategoryItem } from './category-item';
import { Topic } from '@/app/types';

interface CategoriesProps {
    items: Topic[];
}

export const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            <CategoryItem
                key="all"
                label="All"
                value="all"
            />
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.title}
                    value={item.slug}
                />
            ))}
        </div>
    );
};
