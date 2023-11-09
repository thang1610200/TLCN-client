import useSwr from 'swr';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';

const useCourseDetailHome = (slug?: string) => {
    const { data, error, isLoading, mutate} = useSwr<any, AxiosError>(`${BACKEND_URL}/course/detail-course?slug=${slug}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
        //refreshInterval: 500
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useCourseDetailHome;