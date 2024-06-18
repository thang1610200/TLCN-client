"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, stagger, useAnimate, useAnimation } from "framer-motion"

import { CornerDownLeft, SendHorizontal } from 'lucide-react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

export default function AnimationChatGPT({ isInView }: { isInView: boolean }) {
	const question = "Có lợi ích gì khi sử dụng các nền tảng học trực tuyến hỗ trợ trí tuệ nhân tạo?"
	const answer = "Sử dụng nền tảng học trực tuyến hỗ trợ trí tuệ nhân tạo mang lại trải nghiệm học tập cá nhân hóa và linh hoạt, giúp tạo ra một môi trường học tập hiệu quả. Điều này thúc đẩy sự học hỏi theo cách tối ưu cho từng người học, kết quả là sự tiến bộ nhanh chóng và đáng kể trong quá trình đào tạo."
	const texts = useAnimation()
	const background = useAnimation()
	useEffect(() => {
		if (isInView) {
			background.set({
				padding: 0
			})
			background.start({
				padding: 16,
				paddingLeft: 64,
				paddingRight: 64,
				transition: {
					duration: 1,
					ease: "easeInOut",
					delay: 1
				}
			})
			texts.set({
				y: "30vh",
				opacity: 0
			})
			texts.start(i => ({
				y: 0,
				opacity: 1,
				transition: {
					duration: 2,
					ease: "easeInOut",
					delay: i*5
				}
			}))
		}
	}, [isInView, texts, background])
	return (
		<motion.div animate={background} className="w-fit h-fit flex items-center justify-center flex-1 rounded-lg bg-emerald-700 dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
			<div className='flex flex-col items-center justify-center p-4 rounded-lg'>
				<div className="flex flex-col gap-4 p-10 border-8 border-white rounded-lg w-fit h-fit bg-emerald-500 dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
					<motion.div custom={0} animate={texts} className="opacity-0 flex items-start justify-start flex-1 w-full gap-4 rounded-[4rem] h-fit ">
						<div className="">
							<Avatar className='w-12 h-12'>
								<AvatarImage src="/avatars/02.png" />
								<AvatarFallback>OM</AvatarFallback>
							</Avatar>
						</div>
						<div className="relative flex items-center justify-center flex-1 w-full p-4 px-8 overflow-hidden text-left border rounded-lg h-fit text-balance dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
							<TextGenerateEffect words={question} />
						</div>
					</motion.div>
					<motion.div custom={1} animate={texts} className="opacity-0 flex items-start justify-start flex-1 w-full gap-4 rounded-[4rem] h-fit ">
						<div className="">
							<Avatar className='w-12 h-12'>
								<AvatarImage src="/avatars/03.png" />
								<AvatarFallback>OM</AvatarFallback>
							</Avatar>
						</div>
						<div className="relative flex items-center justify-center flex-1 w-full p-4 px-8 overflow-hidden text-left border rounded-lg h-fit text-balance dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
							<TextGenerateEffect words={answer} />
						</div>
					</motion.div>
					<div className="flex-1 w-full mt-24 h-fit">
						<form className="relative overflow-hidden border rounded-lg bg-background ">
							<Label htmlFor="message" className="border-0 sr-only focus-visible:ring-0 selection:border-0 focus-visible:border-0" spellCheck="false" >
								Message
							</Label>
							<Textarea
								spellCheck="false"
								id="message"
								placeholder="Type your message here..."
								className="p-3 border-0 shadow-none resize-none min-h-12 focus-visible:ring-0 selection:border-0 focus-visible:border-0"
							/>
							<div className="flex items-center p-3 pt-0">
								<Button type='button' size="sm" className="ml-auto gap-1.5">
									Send Message
									<CornerDownLeft className="size-3.5" />
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</motion.div>
	)
}


const TextGenerateEffect = ({
	words,
	className,
}: {
	words: string;
	className?: string;
}) => {
	const [scope, animate] = useAnimate();
	let wordsArray = words.split(" ");
	useEffect(() => {
		animate(
			"span",
			{
				opacity: 1,
			},
			{
				duration: 5,
				delay: stagger(0.2),
			}
		);
	},);

	const renderWords = () => {
		return (
			<motion.div ref={scope}>
				{wordsArray.map((word, idx) => {
					return (
						<motion.span
							key={word + idx}
							className="text-black opacity-0 dark:text-white"
						>
							{word}{" "}
						</motion.span>
					);
				})}
			</motion.div>
		);
	};

	return (
		<div className={cn("", className)}>
			<div className="">
				<div className="text-black dark:text-white">
					{renderWords()}
				</div>
			</div>
		</div>
	);
};