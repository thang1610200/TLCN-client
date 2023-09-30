import React from "react";
import Course from "./Course";
import data from "@/public/data.json";

export default function Courses() {
  return (
    <div className="flex flex-col items-start mx-8 mb-8 space-y-3 mt-14">
      <h2 className="text-4xl font-bold">A board selection of courses</h2>
      <h3 className="text-xl">
        Choose from 183,00 online video courses with new addition published
        every month
      </h3>
      <div className="flex ml-1 space-x-4 text-xs font-bold text-gray-500 cursor-pointer lg:text-xl">
        <h3>Python</h3>
        <h3>Excel</h3>
        <h3>Web Development</h3>
        <h3 className="text-black">JavaScript</h3>
        <h3>Data Science</h3>
        <h3>AWS Certification</h3>
        <h3>Drawing</h3>
      </div>

      <div className="w-full text-left border border-gray-300 p-7">
        <h2 className="mb-2 text-2xl font-bold">
          Expand your career opportunities with Universe Code
        </h2>
        <h3>
          Take one of Udemy’s range of Python courses and learn how to code
          using this incredibly useful language. Its simple syntax and
          readability makes Python perfect for Flask, Django, data science, and
          machine learning. You’ll learn how to build everything from
        </h3>
        <button className="p-2 mt-4 mb-8 text-sm font-bold border border-black">
          Universe Code
        </button>
        <div className="flex flex-wrap gap-4 lg:flex-nowrap">
          {data.map((item,i) => (
            <div className="h-60 w-60" key={i}>
              <Course data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
