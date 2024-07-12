import { cn } from "@/lib/utils"
import React, { useMemo, useState, Fragment } from "react";
import { useRouter } from 'next/navigation';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Content, Course, Lesson } from '@/app/types';
import { map, flatten, sumBy, find, filter } from 'lodash';
import useCourseDetailHome from "@/app/hook/useCourseDetailHome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquareIcon, Star, Lock, ChevronUpIcon, Code, Lightbulb, PlaySquare } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Disclosure } from '@headlessui/react';
import { Badge } from '@/components/ui/badge';
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";
import { TrackProps } from 'react-player/file';
import LoadingModal from "@/components/modal/loading-modal";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/constant';
import ListVideoReview from "../../component/list-video-review";
import useAllCoursePublish from "@/app/hook/useAllCoursePublish";
import { CourseCard } from "@/app/home/components/CardCourse";


export default function BentoGridIntroducePage({ data, params }: { data: Course, params: { slug: string } }) {
	const countCompleteLesson = data.userProgress?.reduce((count, item) => count + (item.isCompleted === true ? 1 : 0), 0);
	const isCompleteCourse = countCompleteLesson > data.userProgress?.length / 2;
	return (
		<BentoGrid className="w-screen h-full mx-auto md:auto-rows-min">
			<div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
				<IntroduceVideo data={data} />
			</div>
			<div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
				<InfoCourse data={data} slug={params.slug} />
			</div>
			<div className="md:col-span-1 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
				<ListLesson data={data} />
			</div>
			<div className="md:col-span-2 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
				<GoalRequireCourse data={data} />
			</div>
			{!isCompleteCourse &&
				<div className="md:col-span-3 row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border  justify-between flex flex-col space-y-4">
					<SuggestCourse />
				</div>
			}
		</BentoGrid>
	);
}


const Skeleton = () => (
	<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);




export function GoalRequireCourse({ data }: { data: Course }) {
	if (data) {
		return (
			<div className='w-full h-full max-w-full max-h-full overflow-auto'>
				<Tabs defaultValue="goal" className="w-full h-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="goal">Goal</TabsTrigger>
						<TabsTrigger value="require">Require</TabsTrigger>
						<TabsTrigger value="description">Description</TabsTrigger>
					</TabsList>
					<TabsContent value="goal">
						<Card>
							<CardHeader>
								<CardTitle>What you will learn from this course?</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{data?.learning_outcome.map(
									(item, index) => (
										<div
											key={index}
											className="flex w-full h-full"
										>
											<div className='flex items-start justify-center'>
												<div className="w-5">
													<CheckSquareIcon
														size={20}
														className="text-black dark:text-white"
													/>
												</div>
												<p className="pl-2 text-black dark:text-white">
													{item}
												</p>
											</div>
										</div>
									)
								)}
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="require">
						<Card>
							<CardHeader>
								<CardTitle>What are the prerequisites for starting
									this course?</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{data?.requirement.map((item, index) => (
									<div
										key={index}
										className="flex w-full h-full"
									>
										<div className='flex items-start justify-center'>
											<div className="w-5">
												<CheckSquareIcon
													size={20}
													className="text-black dark:text-white"
												/>
											</div>
											<p className="pl-2 text-black dark:text-white">
												{item}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="description">
						<Card>
							<CardHeader>
								<CardTitle>Description Course</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className='w-full h-full indent-4'>
									{data?.description}
								</div>
							</CardContent>

						</Card>
					</TabsContent>
				</Tabs>
			</div>
		)
	}
}


export function InfoCourse({ data, slug }: { data: Course; slug: string }) {
	const ratings: number = 4.7

	const [isSubmit, setIsSubmit] = useState(false);
	const session = useSession();
	const router = useRouter();
	//console.log(session.data);
	function handleAccessCourse() {
		if (!session.data?.backendTokens?.accessToken) {
			return router.push('/login');
		} else {
			const toastId = toast.loading('Loading...');
			setIsSubmit(true);
			axios.post(`${BACKEND_URL}/user-progress/add-user-progress`, {
				email: session.data?.user.email,
				course_slug: slug
			}, {
				headers: {
					Authorization: `Bearer ${session.data?.backendTokens.accessToken}`,
					"Content-Type": "application/json"
				}
			})
				.then(() => {
					toast.success('Welcome', { id: toastId });
					return router.push(`/course/${slug}/lesson/${data?.chapters[0].contents[0].token}`);
				})
				.catch(() => {
					toast.error('Something went wrong', { id: toastId });
				})
				.finally(() => setIsSubmit(!isSubmit));
		}
	}
	if (data) {
		return (
			<div className='w-full h-full space-y-4'>
				<h1 className='text-4xl font-bold'>{data?.title}</h1>
				<h3 className='text-slate-600'>Được tạo bởi{' '}
					<span className="font-semibold">
						{data?.owner.name}
					</span></h3>
				<Button disabled={isSubmit} className="bg-emerald-500" onClick={() => { handleAccessCourse() }}>
					Tham gia khóa học
				</Button>
			</div>
		)
	}
}




interface VideoListProps {
	data?: Lesson;
	isLocked?: boolean;
}


export function IntroduceVideo({ data }: { data: Course }) {
	const session = useSession();
	const [tokenLesson, setTokenLesson] = useState<string>('');
	const course_content = flatten(map(data?.chapters, 'contents'));
	const lesson = flatten(map(filter(course_content, function (o) {
		if (o.type === "LESSON") return o;
	}), 'lesson'));

	// console.log("Course content: ", course_content)
	// console.log("Lesson: ", lesson)
	// console.log("Find isPreview: ", find(lesson, "isPreview"))
	// console.log("Find tokenLesson: ", find(lesson, { token: tokenLesson }))
	if (data) {
		return (
			<div>
				<VideoReview
					data={!tokenLesson ? find(lesson, "isPreview") : find(lesson, { token: tokenLesson })}
				/>
			</div>
		)
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


export function ListLesson({ data }: { data: Course }) {
	const [isOpen, setIsOpen] = useState(false)

	const course_content = flatten(map(data?.chapters, 'contents'));
	const lesson = flatten(map(filter(course_content, function (o) {
		if (o.type === "LESSON") return o;
	}), 'lesson'));
	const findPreviewToken = find(lesson, "isPreview")
	const [tokenLesson, setTokenLesson] = useState<string>('');


	const [previewContent, setPreviewContent] = useState(findPreviewToken)
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



	function HandleReviewLesson(content: any) {
		if (content.type === 'LESSON' && content.lesson?.isPreview) {
			setIsOpen(true)
			setPreviewContent(content)
		}
	}
	if (data) {
		return (
			<div className="w-full h-full ">
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
											onClick={() => { HandleReviewLesson(content) }}
											key={content_index}
											className={cn(tokenLesson === content.lesson?.token ? "bg-slate-200" : "", 'w-full px-4 pt-4 pb-2 transition-all rounded-lg')}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-start">
													{
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
													}
													<h1 className="text-[18px] inline-block break-words text-black">
														{
															content.lesson?.title || content.exercise?.title
														}
													</h1>
												</div>
												<div className="flex items-center pr-2 ml-auto gap-x-2">
													{
														content.lesson?.isPreview && (
															<Badge className="bg-sky-700">
																Preview
															</Badge>
														)
													}
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
									<ListVideoReview isOpen={isOpen} setIsOpen={setIsOpen} lessonReview={previewContent} data={data} />
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


export function SuggestCourse() {
	const { data, isLoading, error } = useAllCoursePublish(
		undefined,
		[],
		[],
		undefined,
		[]
	);
	return (
		<div className="w-full h-full">
			<h1 className="text-2xl font-bold ">Một số khóa học liên quan</h1>
			<div className='grid w-full grid-cols-3 grid-rows-subgrid h-fit'>
				{data?.map((item, index) => (
					index < 3 && (
						<div key={index} className="flex items-center justify-center w-full h-full">
							<CourseCard
								key={index}
								slug={item.slug}
								title={item.title}
								imageUrl={item.picture!}
								chaptersLength={item.chapters.length}
								total={item.total}
								description={item.description}
							/>
						</div>
					)
				))}
			</div>
		</div>
	)
}
