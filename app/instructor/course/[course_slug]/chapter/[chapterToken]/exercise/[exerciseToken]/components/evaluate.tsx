import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/constant";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface EvaluateFormProps {}

const EvaluateForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const session = useSession();

    const onSubmit = async () => {
        try {
            await axios.post(`${BACKEND_URL}/code/evaluate`, {
                
            },{
                headers: {
                    Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch {

        }
        finally {

        }
    }

    return (
        <>
            
        </>
    );
};

export default EvaluateForm;