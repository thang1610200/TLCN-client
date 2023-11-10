export interface User {
    name: string,
    email: string,
    image: string,
    bio?: string,
    facebook_id?: string
    youtube_id?: string
    titok_id?: string
    role: string;
}

export interface Course {
    title: string,
    isPublished: boolean,
    slug: string;
    description:string;
    learning_outcome: string[];
    requirement: string[];
    picture: string;
    topic_id: string;
    toptic: Topic;
    owner: User;
    chapters: Chapter[]
}

export interface Chapter {
    id: string;
    title: string;
    token: string;
    description: string;
    position: number;
    isPublished: boolean;
    courseId: string;
    lessons: Lesson[]
}

export interface Topic {
    id: string;
    title: string;
    slug: string;
}

export interface Lesson {
    id: string;
    token: string;
    title: string;
    description: string;
    position: number;
    isPublished: boolean;
    videoUrl: string;
    chapterId: string;
    isCompleteVideo: boolean;
    thumbnail: string;
}