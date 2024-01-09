"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import AnimationChatGPT from './components/animation-chatgpt';
import MiniCourse from './components/mini-course';
import Link from 'next/link';
import SecondPage from './components/secondpage';
import { useRef } from 'react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreadPage from './components/thread-page';

export default function HomePage() {
    const refContent = useRef<HTMLDivElement | null>(null)
    const refPage1 = useRef<HTMLDivElement | null>(null)
    const refPage2 = useRef<HTMLDivElement | null>(null)
    const refPage3 = useRef<HTMLDivElement | null>(null)
    const refPage4 = useRef<HTMLDivElement | null>(null)
    const refPage5 = useRef<HTMLDivElement | null>(null)
    const refPage6 = useRef<HTMLDivElement | null>(null)
    const refArray = [refPage1, refPage2, refPage3, refPage4, refPage5, refPage6];
    useGSAP(()=>{
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline();
        refArray.forEach((ref) => {
            gsap.utils.toArray(ref.current).forEach(() => {
                ScrollTrigger.create({
                    trigger: ref.current,
                    start: "top top",
                    scrub: true,
                    pin: true,
                    pinSpacing: false,
                    snap: {
                        snapTo: 11, // snap to the closest label in the timeline
                        duration: { min: 0.2, max: 1 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                        delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
                        ease: "power1.inOut", // the ease of the snap animation ("power3" by default)
                      },
                })
            });
        });
    })
    
    return (
        <div>
            <div ref={refContent} className="">
                <div ref={refPage1} className="flex flex-col items-center justify-center bg-top bg-no-repeat w-dvw h-dvh bg-zinc-800" style={{ backgroundImage: 'url(//web-assets.ifttt.com/packs/media/prosumer/home-hero-a2644b8d67b6842e1bbf.svg)', backgroundSize: "115%", backgroundPositionX: "center", backgroundPositionY: "-10%" }}>
                    <div className="flex items-center justify-center h-56 max-w-4xl mt-20">
                        <h1 className="p-4 leading-normal text-center font-beauSans-extrabold text-7xl text-slate-50 line-clamp-2 ">Khám phá sức mạnh của kiến thức</h1>
                    </div>
                    <div className="">
                        <h2 className="p-4 text-xl text-center font-beauSans-extrabold text-slate-50 text-balance">Nơi kết nối, học hỏi và phát triển mỗi ngày</h2>
                    </div>
                    <div className="p-4">
                        <Button className='h-16 gap-2 text-xl text-center font-beauSans-extrabold w-80 text-slate-50'>
                            <h6>Khám phá ngay</h6>
                            <ArrowRight />
                        </Button>

                    </div>
                </div>
                <div ref={refPage2} className="flex items-center justify-center w-dvw h-dvh bg-slate-50 p-28">
                    <SecondPage />
                </div>
                <div ref={refPage3} className="flex items-center justify-center py-10 w-dvw h-dvh bg-slate-50">
                    <div className="container grid items-center justify-center w-full h-full max-w-full max-h-full grid-cols-2 gap-4 p-20 px-40">
                        <div className="w-full h-full ">
                            <AnimationChatGPT />
                        </div>
                        <div className="flex flex-col items-center justify-center w-full h-full ">
                            <h1 className="p-4 text-6xl font-black leading-tight text-left font-beauSans-extrabold text-slate-900 text-balance">Học tập hiện đại với trí tuệ nhân tạo - Linh hoạt và cá nhân hóa</h1>
                            <p className='p-4 text-xl font-normal leading-normal text-left font-beauSans-extrabold text-slate-900 text-balance'>Với việc sử dụng trí tuệ nhân tạo, chúng tôi tạo ra môi trường học tập linh hoạt, đồng thời cung cấp gợi ý nâng cao. Bạn sẽ không chỉ học từ những chuyên gia hàng đầu mà còn tận hưởng trải nghiệm học tập cá nhân hóa như chưa bao giờ có. </p>
                            <div className="p-4">
                                <Button className='h-12 gap-2 font-sans text-xl font-black text-slate-50 w-60'>
                                    <h6>Khám phá ngay</h6>
                                    <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div> 
                <div ref={refPage4} className="flex items-center justify-center w-dvw h-dvh bg-slate-50 p-28">
                    <div className="flex items-center justify-center w-full h-full p-20 ">
                        <ThreadPage/>
                    </div>
                </div>
                <div ref={refPage5} className="flex items-center justify-center w-dvw h-dvh bg-slate-50 p-28">
                    <div className="flex items-center justify-center w-full h-full p-20 ">
                        <MiniCourse />
                    </div>
                </div>
                <div ref={refPage6} className="flex flex-col items-center justify-center bg-top bg-no-repeat w-dvw h-dvh bg-zinc-800" style={{ backgroundImage: 'url(//web-assets.ifttt.com/packs/media/prosumer/home-hero-a2644b8d67b6842e1bbf.svg)', backgroundSize: "115%", backgroundPositionX: "center", backgroundPositionY: "-10%" }}>
                    <div className="flex flex-col items-center justify-center h-56 max-w-4xl mt-20">
                        <div className="flex items-center justify-center h-56 max-w-4xl mt-20">
                            <h1 className="p-4 leading-normal text-center font-beauSans-extrabold text-7xl text-slate-50 line-clamp-2 ">LEARNER</h1>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xl text-slate-50">
                            <Link href="#" legacyBehavior passHref>About</Link>
                            <Link href="#" legacyBehavior passHref>Features</Link>
                            <Link href="#" legacyBehavior passHref>Works</Link>
                            <Link href="#" legacyBehavior passHref>Support</Link>
                            <Link href="#" legacyBehavior passHref>Help</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}