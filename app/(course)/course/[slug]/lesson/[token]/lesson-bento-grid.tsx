import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useCourseDetailAuth from "@/app/hook/useCourseDetailAuth";
import { Banner } from '@/components/banner';
import useLessonDetailUser from "@/app/hook/useLessonDetailUser";
import QuizModal from "@/app/(course)/component/quiz";
import CodeModal from "@/app/(course)/component/code";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/modal/loading-modal";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Content, Course, Lesson } from "@/app/types";
import { useCallback, useMemo } from "react";
import { findIndex, flatten, map } from "lodash";
import { TrackProps } from "react-player/file";
import { ArrowLeft, ArrowRight, CheckSquareIcon, ChevronUpIcon, Code, Lightbulb, Lock, LockIcon, PlaySquare } from "lucide-react";
import ReactPlayer from "react-player";
import { Disclosure } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Overview from '@/app/(course)/component/overview';
import ResourcesLesson from '@/app/(course)/component/resources';
import ReviewCourse from '@/app/(course)/component/review-course';
import { Button } from '@/components/ui/button';
import CourseProgressButton from '@/app/(course)/component/course-progress-button';
import { Preview } from '@/components/preview';
import SummaryVideo from '@/app/(course)/component/summary-video';
import SupportCode from '@/app/(course)/component/support-code';



export default function BentoGridCoursePage({ params }: { params: { slug: string; token: string } }) {
	const session = useSession();
	const router = useRouter();
	const { data, isLoading, error } = useCourseDetailAuth(
		params.slug,
		session.data?.user.email,
		session.data?.backendTokens.accessToken
	);
	const { content, loadingContent, errorContent, isValidating, mutate } =
		useLessonDetailUser(
			params.slug,
			session.data?.backendTokens.accessToken,
			params.token,
			session.data?.user.email
		);

	const contentlist = useMemo(() => {
		return flatten(map(data?.chapters, 'contents'));
	}, [data?.chapters]);

	const indexLesson = useMemo(() => {
		return findIndex(contentlist, { token: params.token });
	}, [contentlist, params.token]);

	const isOwner = data?.owner.email === session.data?.user.email;
	const isLocked = (content?.userProgress.length === 0 && !isOwner) ? true : false;

	// if (isLoading || loadingContent) {
	// 	return <LoadingModal />;
	// }

	// if (error || errorContent) {
	// 	return router.push("/");
	// }
	if (data && content) {
		return (
			<BentoGrid className="w-screen h-full mx-auto md:auto-rows-min">
				<div className="col-span-3 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
					<MainContent data={data} params={params} contentlist={contentlist} indexLesson={indexLesson} isLocked={isLocked} />
				</div>
				<div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
					<MoreInformation data={data} params={params} contentlist={contentlist} indexLesson={indexLesson} isLocked={isLocked} />
				</div>
				<div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
					<ListLesson data={data} content_token={params.token} course_slug={params.slug} />
				</div>
			</BentoGrid>
		);
	}
}


const Skeleton = () => (
	<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);




export function MoreInformation({ data, params, contentlist, indexLesson, isLocked }: { data: Course, params: { slug: string, token: string }, contentlist: Content[], indexLesson: number, isLocked: boolean }) {
	const router = useRouter();
	const session = useSession();
	const { content, loadingContent, errorContent, isValidating, mutate } =
		useLessonDetailUser(
			params.slug,
			session.data?.backendTokens.accessToken,
			params.token,
			session.data?.user.email
		);
	const onNextLesson = useCallback(() => {
		let index =
			findIndex(contentlist, { token: params.token }) === -1
				? 0
				: findIndex(contentlist, { token: params.token });

		index = index === contentlist.length - 1 ? 0 : index + 1;

		router.push(`/course/${params.slug}/lesson/${contentlist[index].token}`);
	}, [params.slug, contentlist, router, params.token]);

	const onPrevLesson = useCallback(() => {
		let index =
			findIndex(contentlist, { token: params.token }) === -1
				? 0
				: findIndex(contentlist, { token: params.token });

		index = index === 0 ? contentlist.length - 1 : index - 1;

		router.push(`/course/${params.slug}/lesson/${contentlist[index].token}`);
	}, [params.slug, contentlist, router, params.token]);

	if (data && content) {
		//if (content?.type === "LESSON") {
		return (
			<div className='w-full h-full max-w-full max-h-full'>
				<div className="flex justify-between">
					<Button onClick={onPrevLesson}>
						<ArrowLeft className="mr-2" /> Prev
						Lesson
					</Button>
					<Button onClick={onNextLesson}>
						Next Lesson{' '}
						<ArrowRight className="ml-2" />
					</Button>
				</div>
				<div className="flex flex-col items-center justify-between p-6 mt-6 border rounded-md lg:flex-row">
					<h2 className="mb-2 text-lg font-semibold lg:text-2xl lg:mb-0 lg:text-left">
						{!content?.exercise?.code && (
							content?.lesson?.title || content?.exercise?.title
						)}
						{content?.exercise?.code && (
							<Preview
								value={content?.exercise?.code.question}
							/>
						)}
					</h2>
					{!isLocked && (
						<div className="flex items-center space-x-2">
							{
								content?.type === "LESSON" && (
									<CourseProgressButton
										isValidating={isValidating}
										initdata={content}
										course_slug={params.slug}
										mutate={mutate}
										next_lesson={
											contentlist[indexLesson + 1]
										}
									/>
								)
							}
						</div>
					)}
				</div>
				<Tabs defaultValue="overview" className="w-full h-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Tổng quan</TabsTrigger>
						<TabsTrigger value="resources">Tài nguyên</TabsTrigger>
						<TabsTrigger value="reviews">Nhận xét</TabsTrigger>
						{content.type === "LESSON"
							? <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
							: (
								<>
									{content.exercise?.type === "CODE" && (<TabsTrigger value="supportcode">AI Hỗ trợ</TabsTrigger>)}
								</>
							)}
					</TabsList>
					<TabsContent value="overview">
						<Card>
							<CardContent className="space-y-2">
								<Overview lesson={content.lesson} />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="resources">
						<Card>
							<CardContent className="space-y-2">
								<ResourcesLesson
									lesson={content.lesson}
								/>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="reviews">
						<Card>
							<CardContent className="space-y-2">
								<ReviewCourse
									course={data}
									course_slug={params.slug}
								/>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="summary">
						<Card>
							<CardContent className="space-y-2">
								<SummaryVideo course_slug={params.slug} initdata={content} />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="supportcode">
						<Card>
							<CardContent className="space-y-2">
								<SupportCode/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		)
		//}
	}
}


interface VideoListProps {
	data?: Lesson;
	isLocked?: boolean;
}


export function MainContent({ data, params, contentlist, indexLesson, isLocked }: { data: Course, params: { slug: string, token: string }, contentlist: Content[], indexLesson: number, isLocked: boolean }) {
	const session = useSession();
	const { content, loadingContent, errorContent, isValidating, mutate } =
		useLessonDetailUser(
			params.slug,
			session.data?.backendTokens.accessToken,
			params.token,
			session.data?.user.email
		);

	// if (loadingContent) {
	// 	return <LoadingModal />;
	// }

	if (isLocked) {
		return (
			<Banner
				variant="warning"
				label="You need to complete the previous lesson."
			/>
		)
	}
	else {
		if (content?.type === "LESSON") {
			return (
				<div className="relative mb-4 border rounded-md aspect-video bg-slate-100">
					<VideoReview
						data={content.lesson}
						isLocked={isLocked}
					/>
				</div>
			)
		}
		if (content?.type === "EXERCISE" && content.exercise?.type === 'QUIZZ') {
			return (
				<QuizModal
					content_current={content}
					isValidating={isValidating}
					data={content.exercise}
					isLocked={isLocked}
					course_slug={params.slug}
					mutateProgress={mutate}
					next_content_token={
						contentlist[indexLesson + 1]?.token
					}
					quiz={content?.userProgress[0]?.userProgressQuiz}
				/>
			)
		}
		if (content?.type === "EXERCISE" && content.exercise?.type === 'CODE') {
			return (
				<CodeModal
					content_current={content}
					isValidating={isValidating}
					data={content.exercise}
					isLocked={isLocked}
					mutateProgress={mutate}
					course_slug={params.slug}
					next_content_token={
						contentlist[indexLesson + 1]?.token
					}
					codeProgress={content?.userProgress[0]?.userProgressCode || []}
				/>
			)
		}
	}
}






export const VideoReview: React.FC<VideoListProps> = ({ data, isLocked }) => {
	const tracks: TrackProps[] = useMemo(() => {
		if (!data?.subtitles) return [];
		return data?.subtitles.map((item) => {
			return {
				kind: "subtitles",
				src: item.file,
				srcLang: item.language_code,
				label: item.language
			}
		})
	}, [data])


	return (
		<div>
			{isLocked ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2 text-secondary">
					<Lock className="w-8 h-8" />
					<p className="text-sm">This lesson is locked</p>
				</div>
			) : (
				<div className="relative overflow-hidden border-2 rounded-lg aspect-video">
					<div className="absolute top-0 left-0 w-full h-full rounded-lg">
						{data?.videoUrl && (
							<ReactPlayer
								width="100%"
								height="100%"
								light={data?.thumbnail}
								url={data?.videoUrl}
								controls
								playing
								config={{
									file: {
										attributes: {
											crossOrigin: "true"
										},
										tracks
									}
								}}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};


export function ListLesson({ data, course_slug, content_token }: { data: Course, course_slug: string, content_token: string }) {

	const router = useRouter();
	const session = useSession();

	const isOwner = session.data?.user.email === data?.owner.email;

	function convertTime(second: number): string {
		let hour: number = Math.floor(second / 3600);

		if (hour > 0) {
			let minute: number = Math.floor((second % 3600) / 60);

			return `${hour} hour ${minute} minute`;
		} else {
			let minute: number = Math.floor(second / 60);

			return `${minute} minute`;
		}
	}

	const timeChapter = data?.chapters.map((chapter, index) => {
		const timeContents = chapter.contents.map((contents, index) => {
			return contents.lesson?.duration ?? 0
		})
		const sumTime = timeContents.reduce((total: any, currentValue: any) => {
			return total + currentValue
		})
		return convertTime(sumTime)
	})
	if (data) {
		return (
			<div className="w-full h-full overflow-auto">
				{data?.chapters.map((item, index) => {
					return (
						<Disclosure
							key={index}
							as="div"
							className="mb-3"
						>
							{({ open }) => (
								<>
									<Disclosure.Button className="w-full px-4 py-2 text-left border rounded-lg bg-emerald-300 hover:bg-emerald-500 ">
										<div className="flex items-center justify-between font-medium">
											<h2 className="text-xl text-black dark:text-white">{item.title}</h2>
											<ChevronUpIcon size={25} className={cn(open ? 'rotate-180 transform' : '', "mt-5")} />
										</div>
										<h5 className="">{item.contents.length}{' '}lesson •{' '}{timeChapter?.at(index)}{' '}</h5>
									</Disclosure.Button>
									{item.contents.map((content, content_index) => (
										<Disclosure.Panel
											onClick={() => router.push(`/course/${course_slug}/lesson/${content.token}`)}
											key={content_index}
											className={cn('w-full px-4 pt-4 pb-2 cursor-pointer transition-all rounded-lg', (content_token === content.token && 'bg-slate-300'))}>
											<div className="flex items-center justify-between">
												<div className="flex items-start">
													{
														(content?.userProgress.length === 0 && !isOwner) ? (
															<LockIcon
																size={
																	25
																}
																className="mr-2"
																color="#1cdada"
															/>
														) : (
															content.type === "LESSON" ? (
																<PlaySquare
																	size={
																		25
																	}
																	className="mr-2"
																	color="#1cdada"
																/>
															) : (
																content.exercise?.type === 'QUIZZ' ? (
																	<Lightbulb
																		size={
																			25
																		}
																		className="mr-2"
																		color="#1cdada"
																	/>
																) : (
																	<Code
																		size={
																			25
																		}
																		className="mr-2"
																		color="#1cdada"
																	/>
																)
															)
														)
													}
													<h1 className="text-[18px] inline-block break-words text-black">
														{
															content.lesson?.title || content.exercise?.title
														}
													</h1>
												</div>
												<div className="flex items-center pr-2 ml-auto gap-x-2">
													{
														content.type === "LESSON" && (
															<h5 className="text-black">
																{convertTime(
																	content.lesson?.duration || 0
																)}
															</h5>
														)
													}
												</div>
											</div>
										</Disclosure.Panel>
									)
									)}
								</>
							)}
						</Disclosure>
					);
				}
				)}
			</div>
		)
	}
}
