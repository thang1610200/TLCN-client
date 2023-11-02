"use client";

import React from "react";
import Courses from "./Courses";



export default function page() {
  return (
    <>
      <div className="relative w-screen h-screen border-gray-100">
        <img
          src="/images/home_background.webp"
          alt="home image"
          className="object-cover w-full h-full bg-bottom bg-no-repeat"
        />
        <div className="absolute flex flex-col items-start justify-center w-1/2 h-1/2 p-4 mt-20 top-1/4 left-8 md:w-1/3 bg-white bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
          <h2 className="mb-2 text-xl font-bold md:text-3xl">Hi guys welcome</h2>
          <h3 className="text-sm md:text-xl">Look at this project!!!Let's go</h3>
          <h3 className="text-sm md:text-xl">The goal is to learn without stress</h3>
          <p className="text-sm md:text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices lobortis augue sed tempus. </p>
        </div>
      </div>
      <div className="relative">
        {/* <img
          src="/images/next_page_bg.webp"
          alt="home image"
          className="object-cover w-full h-full bg-bottom bg-no-repeat"
        /> */}
        <div className="flex w-screen h-screen p-8 bg-gradient-to-t from-bg-color-1 to-bg-color-2 ">
          <Courses />
        </div>
        <div className="w-screen h-screen bg-slate-500"></div>
      </div>

    </>
  )
}


