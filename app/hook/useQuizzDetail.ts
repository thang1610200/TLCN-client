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

const useQuizzDetail = (email?: string, token?: string, exerciseToken?: string, quizzToken?:string) => {
    const { data, error, isLoading, mutate} = useSwr<any, AxiosError>(token ? [`${BACKEND_URL}/quizz/detail-quizz?email=${email}&token=${quizzToken}&exercise_token=${exerciseToken}`,token]: null, fetcher, {
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

export default useQuizzDetail;