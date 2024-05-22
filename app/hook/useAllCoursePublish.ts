import useSwr from 'swr';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';
import { Course } from '../types';
import qs from 'query-string';


const useAllCoursePublish = (title?: string, topic?:string[], level?: string[], page?: string, duration?: string[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${BACKEND_URL}/course/all-course-publish`,
            query: {
                title,
                topic_slug: topic,
                level_slug: level,
                page,
                duration
            },
        },
        { skipNull: true, skipEmptyString: true }
    );

    const { data, error, isLoading, mutate} = useSwr<any[], AxiosError>(url, fetcher, {
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