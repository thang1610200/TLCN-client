import useSwr from 'swr';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';
import { Course } from '../types';


const useAllCoursePublish = (title?: string, topic?:string) => {
    const { data, error, isLoading, mutate} = useSwr<any[], AxiosError>(`${BACKEND_URL}/course/all-course-publish?topic_slug=${topic ? topic : ""}&title=${title ? title : ""}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useAllCoursePublish;