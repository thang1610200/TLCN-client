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

const useChapterDetail = (slug?: string, email?: string, token?: string, chapterToken?: string) => {
    const { data, error, isLoading, mutate, isValidating} = useSwr<any, AxiosError>(token ? [`${BACKEND_URL}/chapter/find-chapter?course_slug=${slug}&email=${email}&token=${chapterToken}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error,
        isLoading,
        mutate,
        isValidating
    }
}

export default useChapterDetail;