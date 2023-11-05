import { course } from "@/types";
import { BiStar } from "react-icons/bi";
import React from "react";
import Link from "next/link";

interface CourseProps {
  data: course;
}

export default function Course(props: CourseProps) {
  const data = props.data;
  const id = data.id;
  return (
    <Link href={{ pathname: 'course', query: { id: id } }} legacyBehavior passHref>
      <div className="flex flex-col items-start space-y-[1px] hover:bg-slate-100 hover:opacity-50 rounded-lg" >
        <img src={data.picture} alt="" className="w-full h-32 rounded-lg" />
        <h2 className="pt-1 font-bold text-md">{data.title}</h2>
        <h2 className="text-xs text-gray-700">{data.owner_id}</h2>
        <div className="flex space-x-1">
          <div className="flex items-center">
            <BiStar className="w-4 text-orange-400" />
            <BiStar className="w-4 text-orange-400" />
            <BiStar className="w-4 text-orange-400" />
            <BiStar className="w-4 text-orange-400" />
            <BiStar className="w-4 text-orange-400" />
          </div>
        </div>
      </div>
    </Link>
  );
}
