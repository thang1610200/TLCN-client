import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useCourseDetail = (slug?: string, email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<any, AxiosError>(token ? [`${BACKEND_URL}/course/course-slug?slug=${slug}&email=${email}`,token]: null, fetcher, {
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

export default useCourseDetail;