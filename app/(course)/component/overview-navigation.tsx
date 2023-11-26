import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ReviewCourse from './review-course';

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

interface OverviewProps {
    course_slug?: string;
}

export const OverviewNavigation: React.FC<OverviewProps> = ({
    course_slug
}) => {
    const TabsData = [
        {
            label: 'Overview',
            component: ''
        },
        {
            label: 'Resources',
            component: ''
        },
        {
            label: 'Reviews',
            component: <ReviewCourse course_slug={course_slug} />
        }
    ]

    return (
        <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 rounded-md border bg-gray-200">
                {TabsData.map((data, index) => (
                    <Tab
                        key={index}
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-gray-800 shadow'
                                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-800'
                            )
                        }
                    >
                        {data.label}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
                {TabsData.map((data, index) => (
                    <Tab.Panel
                        key={index}
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2'
                        )}
                    >
                        {data.component}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};
