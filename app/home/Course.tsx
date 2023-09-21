import { course } from '@/types'
import { BiStar } from "react-icons/bi"
import React from 'react'


interface CourseProps {
  data: course
}

// const Course:React.FC<CourseProps> = ({data}) => {
//   return (
//     <div className='flex flex-col items-start space-y-[1px]'>
//       <img src="/images/learning.jpg" alt="" className='w-full h-32' />
//       <h2 className='pt-1 font-bold text-md'>{data.title}</h2>
//       <h2 className='text-xs text-gray-700'>{data.username}</h2>
//       <div className="flex space-x-1">
//         <h3 className='text-sm font-bold text-orange-800'>{data.vote}</h3>
//         <div className="flex items-center">
//           <BiStar className="w-4 text-orange-400"/>
//           <BiStar className="w-4 text-orange-400"/>
//           <BiStar className="w-4 text-orange-400"/>
//           <BiStar className="w-4 text-orange-400"/>
//           <BiStar className="w-4 text-orange-400"/>
//         </div>
//         <h3 className='text-xs'>{data.students}</h3>
//       </div>
//       <div className="flex items-center space-x-4">
//         <h3 className='font-bold text-black'>{data.price}</h3>
//         <h3 className='text-sm text-gray-800 line-through'>{data.oldPrice}</h3>
//       </div>
//     </div>
//   )
// }
// export default Course



export default function Course(props: CourseProps) {
  const data = props.data;
  return (
    <div className='flex flex-col items-start space-y-[1px]'>
      <img src="/images/learning.jpg" alt="" className='w-full h-32' />
      <h2 className='pt-1 font-bold text-md'>{data.title}</h2>
      <h2 className='text-xs text-gray-700'>{data.username}</h2>
      <div className="flex space-x-1">
        <h3 className='text-sm font-bold text-orange-800'>{data.vote}</h3>
        <div className="flex items-center">
          <BiStar className="w-4 text-orange-400" />
          <BiStar className="w-4 text-orange-400" />
          <BiStar className="w-4 text-orange-400" />
          <BiStar className="w-4 text-orange-400" />
          <BiStar className="w-4 text-orange-400" />
        </div>
        <h3 className='text-xs'>{data.students}</h3>
      </div>
      <div className="flex items-center space-x-4">
        <h3 className='font-bold text-black'>{data.price}</h3>
        <h3 className='text-sm text-gray-800 line-through'>{data.oldPrice}</h3>
      </div>
    </div>
  )
}

