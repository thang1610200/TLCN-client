import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { UserProgressQuiz } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useProgressQuiz = (token?: string, id?:string) => {
    const { data, error, isLoading, mutate} = useSwr<UserProgressQuiz[], AxiosError>(token ? [`${BACKEND_URL}/user-progress/get-progress-quiz?id=${id}`,token]: null, fetcher, {
        revalidateIfStale: true,
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

export default useProgressQuiz;