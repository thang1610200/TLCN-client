import Link from "next/link";

interface ErrorProps {
    status_code?: number,
    status_name?: string
}


const ErrorModal: React.FC<ErrorProps> = ({
    status_code,
    status_name
}) => {
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500">{ status_code }</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{ status_name }</p>
                    <Link href="/home" className="hover:text-blue-600 inline-block rounded-lg border border-blue-600 px-8 py-3 text-center text-base font-semibold text-blue-600 transition hover:bg-blue-300">
                        Go To Home
                    </Link> 
                </div>   
            </div>
        </div>
    );
}

export default ErrorModal;


