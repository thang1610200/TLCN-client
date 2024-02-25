export interface User {
    name: string,
    email: string,
    image: string,
    bio?: string,
    password?: string,
    facebook_id?: string
    youtube_id?: string
    titok_id?: string
    role: string;
}

export interface Course {
    id: string,
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
    chapters: Chapter[],
    userProgress: UserProgress[]
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
    attachment: Attachment[]
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
    course: Course,
    courseId: string;
    isCompleted: boolean;
    isPassed: boolean;
    userProgressQuiz: UserProgressQuiz[];
    createdAt: Date;
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
    reply: ReviewReply[]
    create_at: Date
}

export interface ReviewReply {
    id: string,
    user: User,
    review: Review,
    reply: string,
    create_at: Date
}

export interface Attachment {
    id: string,
    name: string,
    url: string,
    lessonId: string,
    lesson: Lesson,
    createdAt: Date
}

export enum StatusRegisterInstructor {
    Progressing = 'PROGRESSING',
    Reject = 'REJECT',
    Success = 'SUCCESS',
}

export interface RegisterInstructor {
    user: User;
    userId: string;
    status: StatusRegisterInstructor;
    reply: string;
    createdAt: Date;
}

export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    user: User;
    userId: string;
    serverId: string;
    server: Server;
}

export enum ChannelType {
    Text = 'TEXT',
    Audio = 'AUDIO',
    Video = 'VIDEO',
}

export interface Server {
    token: string;
    name: string;
    user: User;
    imageUrl: string;
    inviteCode: string;
    createAt: Date;
    members: Member[];
    channels: Channel[];
}

export enum MemberRole {
    Admin = 'ADMIN',
    Morderator = 'MODERATOR',
    Guest = 'GUEST',
}

export interface Member {
    id: string;
    role: MemberRole;
    user: User;
    server: Server;
    userId: string;
}