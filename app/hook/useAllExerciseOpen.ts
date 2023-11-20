import useSwr from 'swr';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import { Exercise } from '../types';

const fetcher = async ([url, token]: [string, string]) => {
    const res = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

const useAllExercise = (email?: string, token?: string) => {
    const { data, error, isLoading, mutate} = useSwr<Exercise[], AxiosError>(token ? [`${BACKEND_URL}/exercise/all-exercise?email=${email}`,token]: null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,       // nếu khi gọi dữ liệu bị lỗi thì sẽ gọi lại (true)
    })

    return {
        data,
        error_exercise : error,
        isLoading,
        mutate
    }
}

export default useAllExercise;