"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Courses from "./Courses";



export default function page() {
  const session = useSession();
  return (
    <>
      <div className="relative w-full border-gray-100 h-96 pt-[74px]">
        <img
          src="/images/learning.webp"
          alt="home image"
          className="object-cover w-full h-full bg-bottom bg-no-repeat"
        />
        <div className="absolute bg-white top-12 left-8 p-4 flex flex-col items-start justify-center shadow-lg h-40 w-[440px] mt-[74px]">
          <h2 className="mb-2 text-3xl font-bold">Hi guys welcome</h2>
          <h3 className="text-xl">Look at this project!!!Let's go</h3>
          <h3 className="text-xl">The goal is to learn without stress</h3>
        </div>
      </div>
      <Courses />
      <img src={session.data?.user.image} alt="" />
    </>
  )
}


