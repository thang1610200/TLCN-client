import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MiniCourse() {
  const array: number[] = [1, 2, 3, 4, 5];
  return (
    <section className="flex items-center justify-center w-full h-full ">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Khóa học nổi bật</h2>
          <p className="mt-4 text-base font-normal leading-7 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
        </div>

        <div className="grid grid-cols-2 mt-10 gap-x-4 lg:grid-cols-4 gap-y-2">
          <div className="relative grid row-span-4 group grid-rows-subgrid">
            <div className="overflow-hidden aspect-square rounded-3xl">
              <Image className='object-cover w-full h-full transition-all duration-300 group-hover:scale-125' src="/images/learning.jpg" alt='image product' width={410} height={410} />
            </div>
            <div className="grid items-start justify-between row-span-3 grid-rows-subgrid">
              <div className=''>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                  <Link href="/" legacyBehavior passHref>Javascript cho người mới bắt đầu</Link>
                </h3>
              </div>
              <div className="">
                <p className="font-light text-gray-900 sm:text-sm md:text-xs">Hau Nguyen</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-px">
                  {array.map((item, index) => (
                    <div key={index}><svg className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg></div>
                  ))}
                </div>
                <div className="font-light text-gray-900 sm:text-sm md:text-xs">{"(491)"}</div>
              </div>
            </div>
          </div>



          <div className="relative grid row-span-4 group grid-rows-subgrid">
            <div className="overflow-hidden aspect-square rounded-3xl">
              <Image className='object-cover w-full h-full transition-all duration-300 group-hover:scale-125' src="/images/learning.jpg" alt='image product' width={410} height={410} />
            </div>
            <div className="grid items-start justify-between row-span-3 grid-rows-subgrid">
              <div className=''>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                  <Link href="/" legacyBehavior passHref>React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners</Link>
                </h3>
              </div>
              <div className="">
                <p className="font-light text-gray-900 sm:text-sm md:text-xs">Hỏi Dân IT với Eric</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-px">
                  {array.map((item, index) => (
                    <div key={index}><svg className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg></div>
                  ))}
                </div>
                <div className="font-light text-gray-900 sm:text-sm md:text-xs">{"(491)"}</div>
              </div>
            </div>
          </div>

          <div className="relative grid row-span-4 group grid-rows-subgrid">
            <div className="overflow-hidden aspect-square rounded-3xl ">
              <Image className='object-cover w-full h-full transition-all duration-300 group-hover:scale-125' src="/images/learning.jpg" alt='image product' width={410} height={410} />
            </div>
            <div className="grid items-start justify-between row-span-3 grid-rows-subgrid">
              <div className=''>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                  <Link href="/" legacyBehavior passHref>Viết ứng dụng bán hàng với Java Springboot/API và Angular</Link>
                </h3>

              </div>
              <div className="">
                <p className="font-light text-gray-900 sm:text-sm md:text-xs">Nguyen Duc Hoang</p>
              </div>
              <div className="flex items-center ">
                <div className="flex items-center space-x-px">
                  {array.map((item, index) => (
                    <div key={index}><svg className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg></div>
                  ))}
                </div>
                <div className="font-light text-gray-900 sm:text-sm md:text-xs">{"(491)"}</div>
              </div>
            </div>
          </div>

          <div className="relative grid row-span-4 group grid-rows-subgrid">
            <div className="overflow-hidden aspect-square rounded-3xl">
              <Image className='object-cover w-full h-full transition-all duration-300 group-hover:scale-125' src="/images/learning.jpg" alt='image product' width={410} height={410} />
            </div>
            <div className="grid items-start justify-between row-span-3 grid-rows-subgrid">
              <div className=''>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base line-clamp-2">
                  <Link href="/" legacyBehavior passHref>AWS Cloud for beginner (Vietnamese)</Link>
                </h3>
              </div>
              <div className="">
                <p className="font-light text-gray-900 sm:text-sm md:text-xs">Linh Nguyen</p>
              </div>
              <div className="flex items-center ">
                <div className="flex items-center space-x-px">
                  {array.map((item, index) => (
                    <div key={index}><svg className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg></div>
                  ))}
                </div>
                <div className="font-light text-gray-900 sm:text-sm md:text-xs">{"(491)"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}
