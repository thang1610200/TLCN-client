

import { Button } from '@/components/ui/button';
import React from 'react';
import { Input } from '@/components/ui/input';
import { DataTable } from './component/data-table';
import { columns } from './component/columns';
import axios from 'axios';
import getSession from '@/app/actions/getSession';
import { BACKEND_URL } from '@/lib/constant';

export default async function HomePage() {
    const session = await getSession();
    const courses = await axios.get(
        `${BACKEND_URL}/course/all-course?email=${session?.user.email}`,
        {
            headers: {
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen p-6 ">

                <div className="w-3/4 p-4 border-4 h-fit">
                    <div className='flex items-center justify-center text-3xl font-bold'>Thread</div>

                    <DataTable columns={columns} data={courses.data} />
                </div>
            </div>
        </>
    );
}
