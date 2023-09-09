import React from 'react'
import { BiCartAlt, BiSearch, BiGlobe, BiMenu } from "react-icons/bi";
import Link from 'next/link'


export default function Navbar() {
  return (
    <div>
      <div className='flex space-x-4 bg-white h-[74px] shadow-lg text-center justify-between items-center px-4'>
        <BiMenu className="w-6 h-6 md:hidden"/>
        <h2 className='text-3xl font-bold'>Udemy</h2>
        <h3 className='hidden text-sm md:block'>Categories</h3>
        <form className='hidden bg-[#f8fafb] md:flex border border-black rounded-3xl flex-1 h-12 items-center'>
          <BiSearch className="w-5 h-5 mx-4 text-gray-400" />
          <input type="text" placeholder='Search for anything' className='text-sm bg-transparent focus:outline-none' />
        </form>
        <h3 className='hidden text-sm lg:block'>Udemy Business</h3>
        <h3 className='hidden text-sm lg:block md:hidden'>Teach on Udemy</h3>
        <div className="flex">
          <BiSearch className="w-6 h-6 text-gray-400 md:hidden"/>
          <BiCartAlt className="w-6 h-6"/>
        </div>
        <div className="justify-end hidden pr-4 space-x-4 md:flex">
          <Link rel="stylesheet" href="\login" >
            <button className='border border-black h-10 text-sm font-bold w-20 hover:bg-[#F5F5F5]'>
              Log In
            </button>
          </Link>
          <Link rel="stylesheet" href="\signup" >
            <button className='w-20 h-10 text-sm font-bold text-white bg-black border border-black'>
              Sign Up
            </button>
          </Link>
          <Link rel="stylesheet" href="\" >
            <button className="border border-black h-10 w-10 flex items-center justify-center hover:bg-[#F5F5F5]">
              <BiGlobe className="w-5 h-5"/>
            </button>
          </Link>
          
        </div>
      </div>
      
    </div>
  )
}
