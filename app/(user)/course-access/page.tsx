'use client';
import { DataTable } from '../components/data-table';
import {Tabs, TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { columns } from '../components/columns';
import useAllCoursePublish from '@/app/hook/useAllCoursePublish';


export default function page() {
    const { data, isLoading, error } = useAllCoursePublish(
        undefined,
        undefined
    );
    if(!data){
        return <div>Hãy xóa sau khi thay đổi data fetch</div>
    }
    return (
        <div className='w-full h-full'>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <DataTable columns={columns} data={data} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
