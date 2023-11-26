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
    duration: number;
    exerciseId: string;
    exercise: Exercise;
    userProgress: UserProgress[];
    amountToPass: number;
}

export interface Exercise {
    id: string;
    token: string;
    title: string;
    type: string;
    isOpen: boolean;
    lessonId: string;
    quizz: Quizz[];
    lesson: Lesson[];
    create_at: Date;
}

export interface Quizz {
    id: string;
    token: string;
    question: string;
    answer: string;
    option: string[];
    position: number;
    isPublished: boolean;
    explain: string;
}

export enum TypeExercise {
    Quizz = 'QUIZZ',
    Image = 'IMAGE',
    Code = 'CODE'
}

export enum TypeQuizz {
    TF = "True Or False",
    MC = "Multiple Choice"
}

export enum LevelQuizz {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard"
}

export interface UserProgress {
    id: string;
    user: User,
    isCompleted: boolean;
    isPassed: boolean;
    userProgressQuiz: UserProgressQuiz[]
}

export interface UserProgressQuiz {
    quizzId : string,
    answer: string,
    userProgressId: string
    userProgress: UserProgress,
    isCorrect: boolean
    createdAt: Date
}

export interface Review {
    id: string,
    user: User,
    content: string,
    create_at: Date
}