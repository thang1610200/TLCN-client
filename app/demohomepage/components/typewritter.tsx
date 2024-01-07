"use client"
import React, { useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";



export default function TypeWritter() {
    gsap.registerPlugin(TextPlugin);
    const words = ['Boldness', 'Clarity', 'Originality', 'Precision']
    const sentence = "Học tập hiện đại với trí tuệ nhân tạo - Linh hoạt và cá nhân hóa"
    const typewritter = useRef<HTMLSpanElement | null>(null)
    const cursor = useRef<HTMLSpanElement | null>(null)
    useGSAP(() => {
        let mainTimeline = gsap.timeline({
            repeat: -1
        })
        let textTimeline = gsap.timeline({
            repeat: -1,
            yoyo: true,
            repeatDelay: 10
        })
        textTimeline.to(typewritter.current, {
            text: sentence,
            duration: 4,
            ease: "none"
        })
        let cursorTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: .4
        })
        cursorTimeline.to(cursor.current, {
            opacity: 0,
            duration: 0,
            delay: .4
        })
        mainTimeline.add(textTimeline)

    })
    return (
        <>
            {/* <h1 className='p-4 leading-normal text-center font-beauSans-extrabold text-7xl'>
                <span className='p-4 leading-normal text-center font-beauSans-extrabold text-7xl' ref={typewritter}></span>
                <span className='p-4 leading-normal text-center font-beauSans-extrabold text-7xl' ref={cursor} >|</span>
            </h1> */}
            <div className="">
                <h1 className="p-4 text-6xl font-black leading-tight text-left font-beauSans-extrabold text-slate-900 ">
                    <span className='text-6xl font-black leading-tight text-left font-beauSans-extrabold text-slate-900' ref={typewritter}></span>
                    <span className='text-6xl font-black leading-tight text-left font-beauSans-extrabold text-slate-900' ref={cursor} >|</span>
                </h1>
                <p className='p-4 text-xl font-normal leading-normal text-left font-beauSans-extrabold text-slate-900 text-balance'>Với việc sử dụng trí tuệ nhân tạo, chúng tôi tạo ra môi trường học tập linh hoạt, đồng thời cung cấp gợi ý nâng cao. Bạn sẽ không chỉ học từ những chuyên gia hàng đầu mà còn tận hưởng trải nghiệm học tập cá nhân hóa như chưa bao giờ có. </p>
            </div>
        </>
    )
}
