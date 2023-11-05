import React from "react";
import Course from "./Course";
import data from "@/public/data_course_example.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { course } from "@/types";

interface courseProps {
  data: course[];
}

export default function Courses(props: courseProps) {
  const data = props.data;
  return (

    <div className="p-4 w-screen h-screen relative flex flex-col items-center justify-center  text-slate-600 bg-white bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]" >
      <h2 className="text-4xl font-bold">A board selection of courses</h2>
      <h3 className="text-xl">
        Choose from 183,00 online video courses with new addition published
        every month
      </h3>
      <div className="flex items-center justify-center w-full ml-1 space-x-4 text-xs font-bold text-gray-500 cursor-pointer lg:text-xl">
        <h3>Python</h3>
        <h3>Excel</h3>
        <h3>Web Development</h3>
        <h3 className="text-black">JavaScript</h3>
        {/* <h3>Data Science</h3>
        <h3>AWS Certification</h3>
        <h3>Drawing</h3> */}
      </div>

      <div className="w-full h-full mx-6 text-left rounded-lg ">
        <h2 className="flex items-center justify-center mb-2 text-2xl font-bold">
          Expand your career opportunities with Universe Code
        </h2>
        <h3 className="flex items-center justify-center text-center">
          Take one of Udemy’s range of Python courses and learn how to code
          using this incredibly useful language. Its simple syntax and
          readability makes Python perfect for Flask, Django, data science, and
          machine learning. You’ll learn how to build everything from
        </h3>
        <div className="hidden p-4 md:block">
          <div className="">
            <div className="bg-white bg-opacity-25 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(_31,38,135,0.37_)] border rounded-[10px] border-solid border-[rgba(_255,255,255,0.18_)]">
              <div className="grid lg:grid-cols-5">
                <div className="col-span-3 lg:col-span-5">
                  <div className="h-full px-4 py-6 lg:px-8">
                    <Tabs defaultValue="music" className="h-full space-y-6">
                      <TabsContent
                        value="music"
                        className="p-0 border-none outline-none"
                      >
                        <div className="relative">
                          <ScrollArea>
                            <div className="flex pb-4 space-x-4">
                              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                                {data.map((item, i) => (
                                  <div className="h-60 w-60" key={i}>
                                    <Course data={item} />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >

        {/* <div className="flex flex-wrap gap-4 lg:flex-nowrap">
          {data.map((item, i) => (
            <div className="h-60 w-60" key={i}>
              <Course data={item} />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
