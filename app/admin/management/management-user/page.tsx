import { Metadata } from 'next';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import getSession from '@/app/actions/getSession';
import { DataTable } from './component/data-table';
import { columns } from './component/columns';

export const metadata: Metadata = {
    title: 'Course Instructor',
    description: 'Example music app using the components.',
};

export default async function ManagementUserPage() {
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
            <h3 className='relative items-center justify-center mt-10 text-3xl font-bold text-center'>Users Management</h3>
            <Tabs defaultValue="music" className="h-full space-y-6">
                <TabsContent
                    value="music"
                    className="p-0 border-none outline-none"
                >
                    <DataTable columns={columns} data={courses.data} />
                </TabsContent>
            </Tabs>
        </>
    );
}
