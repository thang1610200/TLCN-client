import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { KeyedMutator } from 'swr';
import { useComplie } from '@/app/hook/use-editor-complie';

interface EditorFormProps {
    language: string;
    defaultValue: string;
}

export const CodeInputEditor: React.FC<EditorFormProps> = ({
    language,
    defaultValue,
}) => {
    const session = useSession();
    const router = useRouter();
    const { editorCode, valueCode } = useComplie();

    const handleEditorChange = (data: any) => {
        editorCode(data);
    };

    return (
        // <div className="space-y-4 mt-4">
        <>
            <Editor
                value={valueCode}
                width="100%"
                height="100%"
                language={language}
                theme="oceanic-next"
                //defaultValue={defaultValue}
                onChange={handleEditorChange}
            />
        </>
        // </div>
    );
};
