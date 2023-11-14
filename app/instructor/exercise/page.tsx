import getSession from '@/app/actions/getSession';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';

export default async function ExercisePage(){
    const session = await getSession();
    const exercise = await axios.get(
        `${BACKEND_URL}/exercise/get-exercise?email=${session?.user.email}`,
        {
            headers: {
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return (
        <>
        <Tabs defaultValue="music" className="h-full space-y-6">
            <TabsContent
                value="music"
                className="p-0 border-none outline-none"
            >
                <DataTable columns={columns} data={exercise.data} />
            </TabsContent>
        </Tabs>
    </>
    )
}