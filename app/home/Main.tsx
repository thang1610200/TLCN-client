import React from 'react'
import Image from 'next/image'


export default function Main() {
  return (
    <div className='relative w-full border-gray-100 h-96'>
      <img src="/images/learning.jpg" alt="" className='object-cover w-full h-full bg-bottom bg-no-repeat'/>
      <div className="absolute bg-white top-12 left-8 p-4 flex flex-col items-start justify-center shadow-lg h-40 w-[440px]">
        <h2 className='mb-2 text-3xl font-bold'>Hi guys welcome</h2>
        <h3 className='text-xl'>Look at this project!!!Let's go</h3>
        <h3 className='text-xl'>The goal is to learn without stress</h3>
        
      </div>

    </div>
  )
}
