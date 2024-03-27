
export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    image?: string;
    bio?: string;
    facebook_id?: string;
    youtube_id?: string;
    titok_id?: string;
    role: string;
    registration_date: string;
    verify_date?: Date;
    register_instructor:  RegisterInstructor[];
    course: Course[];
    userProgress: UserProgress[];
    review: Review[];
    reply: ReviewReply[];
    server: Server[];
    member: Member[];
    channel: Channel[];
}

export interface Topic {
    id: string;
    slug?: string;
    title: string;
    course: Course[];
}

export interface Course {
    id: string;
    topic_id: string
    topic: Topic;
    owner_id : string;
    owner: User;
    title: string;
    description?: string
    learning_outcome: string[];
    requirement: string[];
    slug: string
    picture?: string
    chapters: Chapter[];
    isPublished: boolean;
    create_at: Date;
    update_at: Date;
    userProgress: UserProgress[]
    review: Review[]
}

export interface Chapter {
    id: string;
    title: string;
    token: string;
    description?: string;
    position: number;
    isPublished: boolean;
    contents: Content[]
    courseId: string;
    course: Course;
}

export interface Lesson {
    id: string;
    token: string;
    title: string;
    description?: string
    isPublished: boolean;
    isPreview: boolean;
    videoUrl?: string;
    duration?: number;
    isCompleteVideo: boolean;
    thumbnail?: string;
    contentId: string
    content: Content;
    userProgress: UserProgress[]
    attachment: Attachment[]
    subtitles: Subtitle[]
}

export interface Subtitle {
    id: string;
    language: string
    language_code: string;
    file: string;
    lessonId: string
    lesson: Lesson;
    create_at: Date;
    update_at: Date;
  }

export enum ContentType {
    Lesson = 'LESSON',
    Exercise = 'EXERCISE'
}

export interface Content {
    id: string;
    token: string;
    type: ContentType;
    chapterId: string;
    chapter: Chapter;
    position: number;
    lesson?: Lesson;
    exercise?: Exercise;
    userProgress: UserProgress[];
}

export interface Exercise {
    id: string;
    token: string;
    title: string;
    type: TypeExercise;
    contentId: string;
    content: Content;
    create_at: Date;
    update_at: Date;
    number_correct: number;
    isOpen: boolean;
    quizz: Quizz[];
}

export interface Quizz {
    id: string;
    token: string;
    question: string;
    answer?: string;
    option: string[];
    position: number;
    isPublished: boolean;
    exerciseId: string;
    exercise: Exercise;
    explain?: string;
}

export enum TypeExercise {
    Quizz = 'QUIZZ',
    Image = 'IMAGE',
    Code = 'CODE',
}

export enum TypeQuizz {
    TF = 'True Or False',
    MC = 'Multiple Choice',
}

export enum LevelQuizz {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface UserProgress {
    id: string;
    userId: string
    user: User;
    courseId: string;
    course: Course;
    contentId: string;
    content: Content;
    isCompleted: boolean;
    isPassed: boolean;
    userProgressQuiz: UserProgressQuiz[];
}

export interface UserProgressQuiz {
    id: string;
    quizzId: string;
    answer: string;
    userProgressId: string;
    userProgress: UserProgress;
    isCorrect: boolean;
    createdAt: Date;
}

export interface Review {
    id: string;
    userId: string;
    user: User;
    courseId: string;
    course: Course;
    content: string;
    create_at: Date;
    update_at: Date;
    reply: ReviewReply[];
}

export interface ReviewReply {
    id: string;
    userId: string;
    user: User;
    reviewId: string;
    review: Review;
    reply: string;
    create_at: Date;
    update_at: Date;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    lessonId: string;
    lesson: Lesson;
    createdAt: Date;
    updatedAt: Date;
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
    token: string;
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
    id: string;
    token: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
    userId: string;
    user: User;
    createAt: Date;
    updateAt: Date;
    members: Member[]
    channels: Channel[]
}

export enum MemberRole {
    Admin = 'ADMIN',
    Morderator = 'MODERATOR',
    Guest = 'GUEST',
}

export interface Member {
    id: string;
    token: string;
    role: MemberRole;
    user: User;
    server: Server;
    userId: string;
}

export interface Message {
    id: string;
    content: string;
    fileUrl: string;
    member: Member;
    channel: Channel;
    deleted: boolean;
    createAt: Date;
    updateAt: Date;
}

export interface Conversation {
    id: string;
    memberOwnerId: string;
    memberOwner: Member;
    memberGuestId: string;
    memberGuest: Member;
}

export const Language = [
    {
        language: "Vietnamese",
        language_code: 'vi'
    },
    {
        language: "English",
        language_code: 'en'
    },
    {
        language: "US",
        language_code: 'en_us'
    },
    {
        language: "Australian",
        language_code: 'en_au'
    },
    {
        language: "Spanish",
        language_code: 'es'
    },
    {
        language: "French",
        language_code: 'fr'
    },
    {
        language: "German",
        language_code: 'de'
    }
] 
