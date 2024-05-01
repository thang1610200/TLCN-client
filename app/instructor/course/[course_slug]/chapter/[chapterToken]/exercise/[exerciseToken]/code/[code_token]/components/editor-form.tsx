import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';
import qs from 'query-string';

interface EditorFormProps {
    language: string;
    defaultValue: string;
    exercise_token: string;
    code_token?: string;
    mutate: KeyedMutator<any>;
    course_slug: string;
    chapter_token: string;
    fileId: string;
    fileType: 'SOLUTION' | 'EVALUATION'
}

export const EditorForm: React.FC<EditorFormProps> = ({
    language,
    defaultValue,
    exercise_token,
    code_token,
    mutate,
    course_slug,
    chapter_token,
    fileId,
    fileType
}) => {
    const session = useSession();
    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleEditorChange = (data: any) => {
        setValue(data);
    }

    const onSave = async () => {
        setIsLoading(true);
        let url: string = '';

        if(fileType === 'SOLUTION') {
            url = `${BACKEND_URL}/code/update-file-code`;
        }
        else if(fileType === 'EVALUATION') {
            url = `${BACKEND_URL}/code/update-file-test`
        }

        try {
            await axios.patch(url, {
                code_token,
                exercise_token,
                email: session.data?.user.email,
                chapter_token,
                course_slug,
                fileId,
                content: value
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('File updated');
            mutate();
            router.refresh();
        }
        catch {
            toast.error('Something went wrong');
        }
        finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        setIsLoading(true);

        const url = qs.stringifyUrl({
            url: `${BACKEND_URL}/code/delete-file`,
            query: {
                code_token,
                exercise_token,
                email: session.data?.user.email,
                chapter_token,
                course_slug,
                fileId,
            }
        });

        try {
            await axios.delete(url,{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('File deleted');
            mutate();
            router.refresh();
        }
        catch {
            toast.error('Something went wrong');
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4 mt-4">
            <Editor
                value={value}
                height="100px"
                language={language}
                theme="oceanic-next"
                defaultValue={defaultValue}
                onChange={handleEditorChange}
            />
            <div className="flex items-center gap-x-2">
                {
                    fileType === 'SOLUTION' && (
                        <Button disabled={isLoading} type="button" variant={'outline'} onClick={onDelete}>
                            Delete
                        </Button>
                    )
                }
                <Button disabled={isLoading} type="button" onClick={onSave}>
                    Save
                </Button>
            </div>
        </div>
    );
};
