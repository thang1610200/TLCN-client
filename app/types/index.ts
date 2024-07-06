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
    register_instructor: RegisterInstructor[];
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
    topic_id: string;
    topic: Topic;
    level_id: string;
    level: Level;
    owner_id: string;
    owner: User;
    title: string;
    description?: string;
    learning_outcome: string[];
    requirement: string[];
    slug: string;
    picture?: string;
    chapters: Chapter[];
    isPublished: boolean;
    create_at: Date;
    update_at: Date;
    userProgress: UserProgress[];
    review: Review[];
}

export interface Chapter {
    id: string;
    title: string;
    token: string;
    description?: string;
    position: number;
    isPublished: boolean;
    contents: Content[];
    courseId: string;
    course: Course;
}

export interface Lesson {
    id: string;
    token: string;
    title: string;
    description?: string;
    isPublished: boolean;
    isPreview: boolean;
    videoUrl?: string;
    duration?: number;
    //isCompleteVideo: boolean;
    asyncVideo: AsyncVideo;
    thumbnail?: string;
    contentId: string;
    content: Content;
    userProgress: UserProgress[];
    attachment: Attachment[];
    subtitles: Subtitle[];
}

export interface AsyncVideo {
    id: string;
    type: QueueType;
    description: string;
    lessonId : string;
    lesson: Lesson;
    create_at: Date
    update_at: Date
  }

export interface Subtitle {
    id: string;
    language: string;
    language_code: string;
    file: string;
    lessonId: string;
    lesson: Lesson;
    create_at: Date;
    update_at: Date;
}

export enum QueueType {
    Progressing = 'PROGRESSING',
    Completed = 'COMPLETED',
    Warning = "WARNING",
    Error = 'ERROR'
  }

export enum ContentType {
    Lesson = 'LESSON',
    Exercise = 'EXERCISE',
}

export enum LanguageType {
    Html = 'html',
    Python = 'python',
    Cpp = 'cpp',
    C = 'c',
    Javascript = 'javascript',
    Typescript = 'typescript',
    Css = 'css',
    Java = 'java',
    Php = 'php',
    Cpp_header = 'cpp_header'
}

export enum MimeFileType {
    html = 'html',
    css = 'css',
    javascript = 'js',
    typescript = 'ts',
    cpp = 'cpp',
    c = 'c',
    java = 'java',
    python = 'py',
    php = 'php',
    cpp_header = 'h'
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
    code: Code;
}

export interface LabCode {
    id: string;
    lab: string;
    language: LanguageType[];
    mime: MimeFileType[];
    code: Code[];
}

export interface FileCode {
    id: string;
    fileName: string;
    language: LanguageType;
    mime: MimeFileType;
    default_content: string;
    codeId: string;
    code: Code;
}

export interface FileTest {
    id: string;
    fileName: string;
    language: LanguageType;
    mime: MimeFileType;
    content: string;
    codeId: string;
    code: Code;
}

export interface Code {
    id: string;
    token: string;
    question: string;
    labCodeId: string;
    labCode: LabCode;
    exerciseId: string;
    exercise: Exercise;
    file: FileCode[];
    fileTest: FileTest;
}

export interface Level {
    id: string;
    slug: string;
    name: string;
    course: Course[];
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
    userId: string;
    user: User;
    courseId: string;
    course: Course;
    contentId: string;
    content: Content;
    isCompleted: boolean;
    isPassed: boolean;
    userProgressQuiz: UserProgressQuiz[];
    userProgressCode: UserProgressCode[];
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

export interface UserProgressCode {
    id: string;
    codeId: string;
    fileCodeId: string;
    answer: string;
    userProgressId: string;
    userProgress: UserProgress
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
        language: 'Vietnamese',
        language_code: 'vi',
    },
    {
        language: 'English',
        language_code: 'en',
    },
    {
        language: 'Japanese',
        language_code: 'ja',
    },
    {
        language: 'Spanish',
        language_code: 'es',
    },
    {
        language: 'French',
        language_code: 'fr',
    },
    {
        language: 'German',
        language_code: 'de',
    },
];

export const LanguageOptions = [
    {
        id: 63,
        value: 'javascript',
    },
    {
        id: 45,
        value: 'assembly',
    },
    {
        id: 46,
        value: 'bash',
    },
    {
        id: 47,
        value: 'basic',
    },
    {
        id: 50,
        value: 'c',
    },
    {
        id: 54,
        value: 'cpp',
    },
    {
        id: 86,
        value: 'clojure',
    },
    {
        id: 51,
        value: 'csharp',
    },
    {
        id: 77,
        value: 'cobol',
    },
    {
        id: 55,
        value: 'lisp',
    },
    {
        id: 56,
        value: 'd',
    },
    {
        id: 57,
        value: 'elixir',
    },
    {
        id: 58,
        value: 'erlang',
    },
    {
        id: 44,
        value: 'exe',
    },
    {
        id: 87,
        value: 'fsharp',
    },
    {
        id: 59,
        value: 'fortran',
    },
    {
        id: 60,
        value: 'go',
    },
    {
        id: 88,
        value: 'groovy',
    },
    {
        id: 61,
        value: 'haskell',
    },
    {
        id: 62,
        value: 'java',
    },

    {
        id: 78,
        value: 'kotlin',
    },
    {
        id: 64,
        value: 'lua',
    },

    {
        id: 79,
        value: 'objectivec',
    },
    {
        id: 65,
        value: 'ocaml',
    },
    {
        id: 66,
        value: 'octave',
    },
    {
        id: 67,
        value: 'pascal',
    },
    {
        id: 85,
        value: 'perl',
    },
    {
        id: 68,
        value: 'php',
    },
    {
        id: 69,
        value: 'prolog',
    },
    {
        id: 71,
        value: 'python',
    },
    {
        id: 80,
        value: 'r',
    },
    {
        id: 72,
        value: 'ruby',
    },
    {
        id: 73,
        value: 'rust',
    },
    {
        id: 81,
        value: 'scala',
    },
    {
        id: 83,
        value: 'swift',
    },
    {
        id: 74,
        value: 'typescript',
    },
    {
        id: 84,
        value: 'vbnet',
    },
];
