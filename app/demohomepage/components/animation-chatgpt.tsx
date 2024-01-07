"use client"
import React, { useEffect, useRef, useState } from 'react'
import { SendHorizontal } from 'lucide-react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function AnimationChatGPT() {
  gsap.registerPlugin(TextPlugin);
  const question = "Có lợi ích gì khi sử dụng các nền tảng học trực tuyến hỗ trợ trí tuệ nhân tạo?"
  const answer = "Sử dụng nền tảng học trực tuyến hỗ trợ trí tuệ nhân tạo mang lại trải nghiệm học tập cá nhân hóa và linh hoạt, giúp tạo ra một môi trường học tập hiệu quả. Điều này thúc đẩy sự học hỏi theo cách tối ưu cho từng người học, kết quả là sự tiến bộ nhanh chóng và đáng kể trong quá trình đào tạo."
  const refAvatarUser = useRef<HTMLDivElement | null>(null)
  const refAvatarBot = useRef<HTMLDivElement | null>(null)
  const ChatBot = useRef<HTMLDivElement | null>(null)
  const BoxQuestion = useRef<HTMLDivElement | null>(null)
  const Question = useRef<HTMLSpanElement | null>(null)
  const BoxAnswer = useRef<HTMLDivElement | null>(null)
  const Answer = useRef<HTMLSpanElement | null>(null)
  const Cursor = useRef<HTMLSpanElement | null>(null)
  const InputText = useRef<HTMLSpanElement | null>(null)
  const SendButton = useRef<HTMLDivElement | null>(null)
  const [isSend, setIsSend] = useState(false)
  const handleSendMessage = () => {
    setIsSend(true)
    if (InputText.current) {
      InputText.current.textContent = '...';
    }
  }
  useGSAP(() => {
    let tlButton = gsap.timeline({
      repeat: -1,
    })
    if (isSend) {
      let Timeline = gsap.timeline({
        repeat: 0,
      })
      Timeline.to(refAvatarUser.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "expo.inOut",
        delay: .5
      })
      .to(BoxQuestion.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.inOut",
        delay: .5
      })
        .to(Question.current, {
          text: question,
          duration: 0.5,
          ease: "expo.inOut"
        })
        .to(refAvatarBot.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "expo.inOut",
          delay: .5
        })
        .to(BoxAnswer.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "expo.inOut",
          delay: .5
        })
        .to(Answer.current, {
          text: answer,
          duration: 15,
          ease: "none"
        })
      let cursorTimeline = gsap.timeline({
        repeat: 100,
        repeatDelay: .4
      })
      cursorTimeline.to(Cursor.current, {
        opacity: 0,
        duration: 0,
        delay: .4
      })
      let SendMessage = gsap.timeline({
        repeat: -1,
      })
      tlButton.pause()
    }
    else {
      tlButton.to(SendButton.current, {
        keyframes: {
          "0%": { scale: 1, transformOrigin: "center center", ease: 'sine.out',rotate: 0},
          "10%": { scale: 0.71, ease: 'sine.in',  rotate: 10},
          "17%": { scale: 0.88, ease: 'sine.out', rotate: 0},
          "33%": { scale: 0.67, ease: 'si75ne.in',  rotate: -10 },
          "45%": { scale: 1, ease: 'sine.out', rotate: 0},
          easeEach: 'expo.inOut' // ease between keyframes
        },
        ease: 'none', // ease the entire keyframe block
        duration: 2,
      })
    }
  }, [isSend])
  return (
    <div className='flex flex-col w-full h-full p-6 border-4 rounded-3xl'>
      <div ref={ChatBot} className="grid w-full h-full grid-row-3 rounded-3xl">
        <div className="flex items-center justify-end w-full h-full space-x-4 ">
          <div className="flex items-center w-3/5 h-20 translate-y-full opacity-0 rounded-3xl bg-slate-300" ref={BoxQuestion}>
            <h1 className="px-4 text-base font-black leading-tight text-left font-beauSans text-slate-900" >
              <span className='text-base font-black leading-tight text-left font-beauSans text-slate-900' ref={Question}></span>
            </h1>
          </div>
          <div className="translate-y-full opacity-0" ref={refAvatarUser}>
            <Avatar className='w-16 h-16'>
              <AvatarImage src="/avatars/02.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex items-center w-full h-full space-x-4">
          <div className="translate-y-full opacity-0" ref={refAvatarBot}>
            <Avatar className='w-16 h-16'>
              <AvatarImage src="/avatars/03.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center w-3/5 translate-y-full border-4 opacity-0 h-52 rounded-3xl" ref={BoxAnswer}>
            <h1 className="px-4 text-base font-black leading-tight text-left font-beauSans text-slate-900 " >
              <span className='text-base font-black leading-tight text-left font-beauSans text-slate-900' ref={Answer}></span>
              <span className='text-base font-black leading-tight text-left font-beauSans text-slate-900' ref={Cursor} >|</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center w-full h-full">
        </div>
      </div>

      <div className="w-full h-24 ">
        <div className="flex items-center justify-between w-full h-full gap-4 rounded-lg">
          <span ref={InputText} className='flex flex-wrap items-center w-full h-full p-4 text-base font-black leading-tight text-left border-4 rounded-lg font-beauSans text-slate-900 grow disabled:opacity-100'>Có lợi ích gì khi sử dụng các nền tảng học trực tuyến hỗ trợ trí tuệ nhân tạo?</span>
          <div className="flex items-center justify-center h-full" ref={SendButton}>
            <SendHorizontal className='w-full h-5/6' onClick={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
    
  )
}
