import useSwr from 'swr';
import { AxiosError } from 'axios';
import { BACKEND_URL } from '@/lib/constant';
import fetcher from '@/lib/fetcher';
import { Topic } from '../types';


const useAllTopicHome = () => {
    const { data, error, isLoading, mutate} = useSwr<Topic[], AxiosError>(`${BACKEND_URL}/course/all-topic-home`, fetcher, {
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

export default useAllTopicHome;