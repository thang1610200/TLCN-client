"use client";

import React from 'react'
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SecondPage() {

  const refPage2 = useRef<HTMLDivElement | null>(null)
  const refRightPage2 = useRef<HTMLDivElement | null>(null)
  const refLeftPage2 = useRef<HTMLDivElement | null>(null)
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    let Timeline = gsap.timeline({
      repeat: 0,
    })
    Timeline.fromTo(refRightPage2.current, {
      xPercent: 100,
      yPercent: 100,
      rotateZ: -180,

    }, {
      scrollTrigger: {
        trigger: refPage2.current,
        start: "-50% center",
        end: "top center",
        scrub: 3,
      },
      xPercent: 0,
      yPercent: 0,
      ease: "none",
      duration: 3,
      rotateZ: 0
    })
      .fromTo(refRightPage2.current, {
        xPercent: 0,
        yPercent: 0,
        rotateZ: 0
      }, {
        scrollTrigger: {
          trigger: refPage2.current,
          start: "bottom center",
          end: "150% center",
          scrub: 3,
        },
        xPercent: 100,
        yPercent: -100,
        rotateZ: 180,
        ease: "none",
        duration: 3,
      })


    Timeline.fromTo(refLeftPage2.current, {
      xPercent: -100,
      yPercent: 100,
      rotateZ: 180,
    }, {
      scrollTrigger: {
        trigger: refPage2.current,
        start: "-50% center",
        end: "top center",
        scrub: 3,
      },
      xPercent: 0,
      yPercent: 0,
      rotateZ: 0,
      ease: "none",
      duration: 3,
    })
      .fromTo(refLeftPage2.current, {
        xPercent: 0,
        yPercent: 0,
        rotateZ: 0,
      }, {
        scrollTrigger: {
          trigger: refPage2.current,
          start: "bottom center",
          end: "150% center",
          scrub: 3,
        },
        xPercent: -100,
        yPercent: -100,
        rotateZ: -180,
        ease: "none",
        duration: 3,
      })
  })
  return (
    <div ref={refPage2} className="container grid items-center justify-center grid-cols-2 gap-4 p-20 ">
      <div ref={refLeftPage2} className="">
        <h1 className="p-4 text-6xl font-black leading-tight text-left font-beauSans-extrabold text-slate-900 text-balance">Khám phá sự đa dạng và chất lượng khóa học</h1>
        <p className='p-4 text-xl font-normal leading-normal text-left font-beauSans-extrabold text-slate-900 text-balance'>Với nhiều chủ đề phong phú, chúng tôi cam kết mang đến cho bạn trải nghiệm học tập độc đáo và chất lượng hàng đầu. Hãy tận hưởng hành trình học tập và phát triển bản thân theo cách riêng của bạn!</p>
        <div className="p-4">
          <Button className='h-12 gap-2 font-sans text-xl font-black text-slate-50 w-60'>
            <h6>Khám phá ngay</h6>
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div ref={refRightPage2} className=" bg-slate-50">
        <Image
          className='mix-blend-multiply '
          src="/images/learning.jpg"
          width={500}
          height={500}
          alt="Picture learning"
        />
      </div>
    </div>
  )
}
